<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="d-flex align-items-center">
        <BackButton />
        <LoadingIndicator v-if="loading" />
      </div>
      <div class="table-responsive mt-3">
        <table class="table table-hover table-sm text-nowrap">
          <thead>
            <tr>
              <th
                v-for="column in COLUMNS"
                :key="column.key"
                :data-test="`sort-${column.key}`"
                :class="{ 'text-center': column.numeric }"
                :aria-sort="sort.key === column.key ? (sort.desc ? 'descending' : 'ascending') : 'none'"
                role="button"
                @click="sortBy(column.key)"
              >
                <i
                  class="bi"
                  :class="sort.key === column.key ? (sort.desc ? 'bi-sort-down' : 'bi-sort-up') : 'bi-arrow-down-up text-muted'"
                />
                {{ $t(`port.label.${column.key}`) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in sortedRows"
              :key="`${row.code}-${row.boughtAt}`"
            >
              <td>{{ row.code }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.boughtAt }}</td>
              <td class="text-end">
                {{ formatYen(row.buy) }}
              </td>
              <td
                data-test="current-price"
                class="text-end"
                :class="priceTrendClass(row.buy, row.currentPrice)"
              >
                {{ formatYen(row.currentPrice) }}
              </td>
            </tr>
            <tr v-if="!loading && rows.length === 0">
              <td
                :colspan="COLUMNS.length"
                class="text-center text-muted"
              >
                {{ $t('port.empty') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { fetchPortfolio } from '../api';
import { currentSession } from '../auth';
import { formatYen, priceTrendClass } from '../format';
import { notify } from '../notify';
import BackButton from '../components/BackButton.vue';
import LoadingIndicator from '../components/LoadingIndicator.vue';

const COLUMNS = [
  { key: 'code' },
  { key: 'name' },
  { key: 'boughtAt' },
  { key: 'buy', numeric: true },
  { key: 'currentPrice', numeric: true },
];

const loading = ref(true);
const rows = ref([]);
const sort = ref({ key: 'boughtAt', desc: true });

// 金額は数値のまま持ち、表示するときだけ整形します。
const toRow = (trading) => ({
  code: trading.code,
  name: trading.name,
  boughtAt: String(trading.bought_at).slice(0, 10),
  buy: Number(trading.buy),
  currentPrice: Number(trading.current_price),
});

const sortedRows = computed(() => {
  const { key, desc } = sort.value;
  return [...rows.value].sort((a, b) => {
    const order = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
    return desc ? -order : order;
  });
});

function sortBy(key) {
  sort.value = { key, desc: sort.value.key === key ? !sort.value.desc : false };
}

onMounted(async () => {
  notify('info', 'notify.portfolioLoading');
  const { token, userId } = currentSession();
  const result = await fetchPortfolio(token, userId);
  loading.value = false;
  if (!result.ok || !Array.isArray(result.data?.tradings)) {
    notify('error', result.status === 0 ? 'notify.networkError' : 'notify.loadFailed');
    return;
  }
  rows.value = result.data.tradings.map(toRow);
  notify('success', 'notify.portfolioLoaded');
});
</script>
