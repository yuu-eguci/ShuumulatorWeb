<template>
  <div class="chart-container">
    <canvas ref="canvas" />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, toRaw, watch } from 'vue';
import {
  BarController, BarElement, CategoryScale, Chart, Legend,
  LinearScale, LineController, LineElement, PointElement, Tooltip,
} from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, Legend, LinearScale, LineController, LineElement, PointElement, Tooltip);

defineOptions({ name: 'RealizedChart' });

const props = defineProps({
  chartData: { type: Object, required: true },
});

const OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { stacked: true },
    y: { stacked: true, beginAtZero: true },
  },
};

const canvas = ref(null);
let chart = null;
const plainData = () => structuredClone(toRaw(props.chartData));

onMounted(() => {
  chart = new Chart(canvas.value, { type: 'bar', data: plainData(), options: OPTIONS });
});

watch(() => props.chartData, () => {
  chart.data = plainData();
  chart.update();
});

onBeforeUnmount(() => {
  chart?.destroy();
});
</script>
