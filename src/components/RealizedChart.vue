<script>
// 本 vue には template を書きません。
import { Bar, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;

export default {

  name: 'RealizedChart',

  extends: Bar,

  mixins: [reactiveProp],

  // NOTE: renderChart で使っている chartData は mixin に渡される prop です。
  //       そのためここの props に記述する必要がありません。
  props: {
    options: {
      type: Object,
      required: true,
    },
  },

  mounted () {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options);
  },

}
</script>
