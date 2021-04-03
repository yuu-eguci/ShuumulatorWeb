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
                現在の勝率: 79%
              </b-card-text>
              <b-card-text>
                総獲得額: 2,598円
              </b-card-text>
              <b-card-text>
                総損失額: 2,598円
              </b-card-text>
              <b-card-text>
                実現損益: +2,598円
              </b-card-text>
            </b-card>
          </b-col>
          <b-col md="6">
            <b-card
              no-body
              class="p-3"
            >
              <b-card-text>
                グラフの目盛り
              </b-card-text>
              <b-card-text>
                <b-form-select
                  v-model="selectedScale"
                  :options="[
                    { value: 'all', text: 'すべて' },
                    { value: 'month', text: '月ごと' },
                    { value: 'week', text: '週ごと' },
                    { value: 'day', text: '日ごと' },
                  ]"
                  :disabled="loading"
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
      selectedScale: 'all',

      // chartjs へ渡すデータです。
      // NOTE: データ形式は公式サイトを参照します。
      //       https://vue-chartjs.org/ja/guide/#最初のチャートの作成
      //       > チャート毎に必要なオブジェクト構造は公式 Chart.js docsをチェックしてください。
      //       > https://www.chartjs.org/docs/latest/#creating-a-chart
      datacollection: null,
      options: {
        responsive: true,
        maintainAspectRatio: false
      },

    };

  },

  async mounted () {

    // TODO: まだ、ほしい chart のかたちになっていないが、それはのちに。
    this.fillData()

  },

  methods: {

    fillData () {
      this.datacollection = {
        labels: [this.getRandomInt(), this.getRandomInt()],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: [this.getRandomInt(), this.getRandomInt()]
          }, {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: [this.getRandomInt(), this.getRandomInt()]
          }
        ]
      }
    },
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    }

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
