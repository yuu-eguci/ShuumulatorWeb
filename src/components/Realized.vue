<template>
  <div>
    <b-row>
      <b-col md="2" />
      <b-col md="8">
        <b-row>
          <b-col md="6">
            <b-card
              no-body
              class="p-3"
            >
              <b-card-text>
                {{ $t('realized.winRate') }}: {{ winRate }}%
              </b-card-text>
              <b-card-text class="text-danger">
                {{ $t('realized.totalGain') }}: {{ totalGain }}{{ $t('realized.yen') }}
              </b-card-text>
              <b-card-text class="text-success">
                {{ $t('realized.totalLost') }}: {{ totalLost }}{{ $t('realized.yen') }}
              </b-card-text>
              <b-card-text>
                {{ $t('realized.realized') }}: {{ realizedProfit }}{{ $t('realized.yen') }}
              </b-card-text>
            </b-card>
          </b-col>
          <b-col md="6">
            <b-card
              no-body
              class="p-3"
            >
              <b-card-text>
                {{ $t('realized.graphScale') }}
              </b-card-text>
              <b-card-text>
                <b-form-select
                  v-model="selectedEach"
                  :options="[
                    { value: 'year', text: $t('realized.eachYear') },
                    { value: 'month', text: $t('realized.eachMonth') },
                    { value: 'week', text: $t('realized.eachWeek') },
                    { value: 'day', text: $t('realized.eachDay') },
                  ]"
                  :disabled="loading"
                  @change="onChangeSelect"
                />
              </b-card-text>
            </b-card>
          </b-col>
          <b-col md="12">
            <RealizedChart
              :chart-data="datacollection"
              :options="options"
            />
          </b-col>
        </b-row>
      </b-col>
      <b-col md="2" />
    </b-row>
  </div>
</template>

<script>
import RealizedChart from '@/components/RealizedChart.vue';
import axiosUtils from '@/utils/axiosUtils';
import Cookies from 'js-cookie';

const fetchRealized = async function (each) {

  // cookie から jwt token を取得します。
  const token = Cookies.get('token');

  // /api/v1/realized を取得します。
  const axiosInstance = axiosUtils.createAxiosInstance(token);
  const response = await axiosInstance.get('/api/v1/realized/1', {
    params: {
      each,
    },
  }).catch(err => {
    return err.response;
  });
  if (response.status !== 200) {
    console.error(response);
    return;
  }
  return response.data;

};

export default {

  name: 'Realized',

  components: {
    RealizedChart,
  },

  data() {

    return {

      // 演出のための data です。
      loading: false,

      // 検索用の data です。
      selectedEach: 'year',

      winRate: '0',
      totalGain: '0',
      totalLost: '0',
      realizedProfit: '0',

      // chartjs へ渡すデータです。
      // NOTE: データ形式は公式サイトを参照します。
      //       https://vue-chartjs.org/ja/guide/#最初のチャートの作成
      //       > チャート毎に必要なオブジェクト構造は公式 Chart.js docsをチェックしてください。
      //       > https://www.chartjs.org/docs/latest/#creating-a-chart
      datacollection: null,
      options: {
        responsive: true,
        scales: {
          yAxes: [{
            stacked: true,
            ticks: {
              beginAtZero: true,
            },
          }],
          xAxes: [{
            stacked: true,
            ticks: {
              beginAtZero: true,
            },
          }]
        },
        maintainAspectRatio: false,
      },

    };

  },

  async mounted () {

    const result = await fetchRealized(this.selectedEach);
    this.updateData(result);
    // each: "year"
    // realized: Array(1)
    //   0: {gain: 13951.1, lost: 11385.4, label: "2021"}
    // total_gain: 13951.1
    // total_lost: 11385.4
    // user_id: "1"
    // win_rate: 0.6192560175054704

    // TODO: まだ、ほしい chart のかたちになっていないが、それはのちに。
    // this.fillData()

  },

  methods: {

    updateData: function (rawData) {

      console.info(rawData);

      this.selectedEach = rawData.each;
      this.winRate = Math.round(rawData['win_rate'] * 100);
      this.totalGain = (rawData['total_gain'] * 100).toLocaleString();
      this.totalLost = (rawData['total_lost'] * 100).toLocaleString();

      const realizedProfit = (rawData['total_gain'] - rawData['total_lost']) * 100;
      const profitPrefix = realizedProfit >= 0 ? '+' : '-';
      this.realizedProfit = profitPrefix + realizedProfit.toLocaleString();

      // TODO: チャートを更新。
      this.fillData();

    },

    fillData: function () {

      // NOTE: Stacked Bar chart の設定はこんなふうに行う。
      const data = {
        labels: ['foo', 'bar'],
        datasets: [
          {
            label: 'ひとつめのデータセット',
            data: [65, 59],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
            ],
            borderWidth: 1,
          },
          {
            label: 'ふたつめのデータセット',
            data: [-15, -25],
            backgroundColor: [
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
            ],
            borderWidth: 1,
          },
        ],
      };
      this.datacollection = data;

    },

    onChangeSelect: async function () {

      this.loading = true;

      const result = await fetchRealized(this.selectedEach);
      this.updateData(result);

      this.loading = false;

    },

  },

}
</script>

<style scoped>
.btn-circle {
  width: 30px;
  height: 30px;
  padding: 8px 6px;
  border-radius: 35px;
  font-size: 10px;
  line-height: 1;
}
</style>
