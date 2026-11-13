<template>
  <div class="chart-container">
    <canvas ref="canvas" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, toRaw, watch } from 'vue';
import {
  BarController, BarElement, CategoryScale, Chart, Legend,
  LinearScale, LineController, LineElement, PointElement, Tooltip,
  type ChartData, type ChartOptions,
} from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, Legend, LinearScale, LineController, LineElement, PointElement, Tooltip);

defineOptions({ name: 'RealizedChart' });

// 棒グラフに折れ線のデータセット (type: 'line') を重ねられます。
const props = defineProps<{
  chartData: ChartData<'bar' | 'line', number[], string>;
}>();

const OPTIONS: ChartOptions<'bar' | 'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { stacked: true },
    y: { stacked: true, beginAtZero: true },
  },
};

const canvas = ref<HTMLCanvasElement | null>(null);
let chart: Chart<'bar' | 'line', number[], string> | null = null;
const plainData = () => structuredClone(toRaw(props.chartData));

onMounted(() => {
  chart = new Chart<'bar' | 'line', number[], string>(canvas.value!, { type: 'bar', data: plainData(), options: OPTIONS });
});

watch(() => props.chartData, () => {
  chart!.data = plainData();
  chart!.update();
});

onBeforeUnmount(() => {
  chart?.destroy();
});
</script>
