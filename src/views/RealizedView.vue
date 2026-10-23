<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="d-flex align-items-center">
        <BackButton />
        <LoadingIndicator v-if="loading" />
      </div>
      <div class="row mt-3 g-3">
        <div class="col-md-6">
          <div class="card p-3">
            <p
              data-test="win-rate"
              class="card-text"
            >
              {{ $t('realized.winRate') }}: {{ Math.round(summary.winRate * 100) }}%
            </p>
            <p
              data-test="total-gain"
              class="card-text text-danger"
            >
              {{ $t('realized.totalGain') }}: {{ formatYen(summary.totalGain * 100) }}{{ $t('realized.yen') }}
            </p>
            <p
              data-test="total-lost"
              class="card-text text-success"
            >
              {{ $t('realized.totalLost') }}: {{ formatYen(summary.totalLost * 100) }}{{ $t('realized.yen') }}
            </p>
            <p
              data-test="realized"
              class="card-text"
            >
              {{ $t('realized.realized') }}: {{ formatSignedYen((summary.totalGain - summary.totalLost) * 100) }}{{ $t('realized.yen') }}
            </p>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card p-3">
            <label
              for="realized-each"
              class="card-text mb-2"
            >{{ $t('realized.graphScale') }}</label>
            <select
              id="realized-each"
              v-model="each"
              data-test="each"
              class="form-select"
              :disabled="loading"
              @change="load"
            >
              <option
                v-for="scale in SCALES"
                :key="scale"
                :value="scale"
              >
                {{ $t(`realized.${scale}`) }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-md-12">
          <RealizedChart :chart-data="chartData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { fetchRealized } from '../api';
import { currentSession } from '../auth';
import { formatSignedYen, formatYen } from '../format';
import { notify } from '../notify';
import BackButton from '../components/BackButton.vue';
import LoadingIndicator from '../components/LoadingIndicator.vue';
import RealizedChart from '../components/RealizedChart.vue';

// API の each パラメータと i18n キー (realized.<each>) を兼ねます。
const SCALES = ['year', 'month', 'week', 'day'];
// API からは時系列順で届くので、グラフには最後の 12 件だけ出します。
const CHART_PERIODS = 12;

const loading = ref(false);
const each = ref('year');
const summary = ref({ winRate: 0, totalGain: 0, totalLost: 0 });
const chartData = ref({ labels: [], datasets: [] });
let latestRequest = 0;

const toChartData = (realized) => {
  const recent = realized.slice(-CHART_PERIODS);
  return {
    labels: recent.map((x) => x.label),
    datasets: [
      { label: 'Gain', data: recent.map((x) => x.gain * 100), backgroundColor: 'rgba(255, 99, 132, 0.2)', borderColor: 'rgb(255, 99, 132)', borderWidth: 1 },
      { label: 'Lost', data: recent.map((x) => -x.lost * 100), backgroundColor: 'rgba(75, 192, 192, 0.2)', borderColor: 'rgb(75, 192, 192)', borderWidth: 1 },
      { label: 'Balance', type: 'line', data: recent.map((x) => (x.gain - x.lost) * 100), borderColor: 'rgb(154, 162, 235)' },
    ],
  };
};

async function load() {
  // 古いリクエストの結果で新しい結果を上書きしないよう、最後のリクエストだけ反映します。
  const request = ++latestRequest;
  loading.value = true;
  notify('info', 'notify.realizedLoading');
  const { token, userId } = currentSession();
  const result = await fetchRealized(token, userId, each.value);
  if (request !== latestRequest) {
    return;
  }
  loading.value = false;
  if (!result.ok || !Array.isArray(result.data?.realized)) {
    notify('error', result.status === 0 ? 'notify.networkError' : 'notify.loadFailed');
    return;
  }
  const data = result.data;
  each.value = SCALES.includes(data.each) ? data.each : each.value;
  summary.value = { winRate: data.win_rate, totalGain: data.total_gain, totalLost: data.total_lost };
  chartData.value = toChartData(data.realized);
  notify('success', 'notify.realizedLoaded');
}

onMounted(load);
</script>
