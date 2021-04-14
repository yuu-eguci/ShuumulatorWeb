<template>
  <div>
    <b-row>
      <b-col md="2" />
      <b-col md="8">
        <div>
          <b-button
            :to="'/'"
            variant="outline-primary"
            class="btn-circle"
            size="lg"
          >
            <b-icon icon="arrow-left" />
          </b-button>
        </div>
        <b-table
          ref="mainTable"
          hover
          small
          :items="mainTableItems"
          :filter="'meaninglessCriteria'"
          :filter-function="filterTable"
          :fields="visibleFields"
          sort-icon-left
          :responsive="true"
          class="text-nowrap mt-3"
        >
          <!-- NOTE: $t を使うため script 内ではなく template 内でラベルを定義しています。 -->
          <template #head(code)="">
            {{ $t('port.label.code') }}
          </template>
          <template #head(name)="">
            {{ $t('port.label.name') }}
          </template>
          <template #head(boughtAt)="">
            {{ $t('port.label.boughtAt') }}
          </template>
          <template #head(buy)="">
            {{ $t('port.label.buy') }}
          </template>
          <template #head(currentPrice)="">
            {{ $t('port.label.currentPrice') }}
          </template>
        </b-table>
      </b-col>
      <b-col md="2" />
    </b-row>
  </div>
</template>

<script>
import axiosUtils from '@/utils/axiosUtils';
import Cookies from 'js-cookie';

const fetchPortfolio = async function () {

  // cookie から jwt token を取得します。
  const token = Cookies.get('token');

  // /api/v1/portfolio を取得します。
  const axiosInstance = axiosUtils.createAxiosInstance(token);
  const response = await axiosInstance.get('/api/v1/portfolio/1').catch(err => {
    return err.response;
  });
  if (response.status !== 200) {
    console.error(response);
    return;
  }
  return response.data.tradings;

};

const changeFormatForMainTable = function (rawRecord) {

  return {
    code: rawRecord.code,
    name: rawRecord.name,
    boughtAt: rawRecord['bought_at'].slice(0, 10),
    buy: rawRecord.buy.toLocaleString(),
    currentPrice: rawRecord['current_price'].toLocaleString(),
  };

};

export default {

  name: 'Port',

  data() {

    return {

      // 演出のための data です。

      // b-table mainTable 用の data。
      mainTableItems: [],

      // NOTE: visible はユーザ定義プロパティです。詳細は computed.visibleFields に記述します。
      // NOTE: b-table のデフォルトとは異なり、 fields をラップした computed.visibleFields を画面に表示しています。
      //       そのカスタマイズを明示するため、 innerFields の名称にします。
      innerFields: [
        {
          key: 'code',
          // NOTE: label はここでは定義しません。 i18n に対応するため template 内にひとつずつ定義します。
          sortable: true,
          visible: true,
        },
        {
          key: 'name',
          // NOTE: label はここでは定義しません。 i18n に対応するため template 内にひとつずつ定義します。
          sortable: true,
          visible: true,
        },
        {
          key: 'boughtAt',
          // NOTE: label はここでは定義しません。 i18n に対応するため template 内にひとつずつ定義します。
          sortable: true,
          visible: true,
        },
        {
          key: 'buy',
          // NOTE: label はここでは定義しません。 i18n に対応するため template 内にひとつずつ定義します。
          sortable: true,
          visible: true,
          thClass: 'text-center',
          tdClass: 'text-right',
        },
        {
          key: 'currentPrice',
          // NOTE: label はここでは定義しません。 i18n に対応するため template 内にひとつずつ定義します。
          sortable: true,
          visible: true,
          thClass: 'text-center',
          // NOTE: びっくりなんだけどこれで methods へアクセスできる。
          tdClass: 'setCurrentPriceTdClass',
        },
      ],

    };

  },

  // NOTE: 定数にように利用する変数、 props から算出できる値は computed に定義するよう心がけます。
  computed: {

    // NOTE: Checkbox が fields.visible(ユーザ定義)を切り替え、
    //       その変更を受けて本 computed.visibleFields が更新されます。
    //       b-table :fields="visibleFields" なので、 visible=true の fields のみが表示されることになります。
    visibleFields() {
      return this.innerFields.filter(field => field.visible)
    },

  },

  async mounted () {

    const tradings = await fetchPortfolio();
    this.mainTableItems = tradings.map(changeFormatForMainTable);

  },

  // NOTE: 「methods に含めるのは template から利用する method のみ」原則を心がけます。
  methods: {

    // b-table の filter-function です。 true を返す行を表示します。
    // b-table に :filter 属性を設定しないと動作しません。
    filterTable: function (row, filter) {  // eslint-disable-line no-unused-vars

      // NOTE: 今回は filter が必要ない予定だけれど、まあ b-table のオマケとして記述してます。
      return true;

    },

    setCurrentPriceTdClass: function (value, key, item) {

      // 価格が上がっている -> 赤。
      if (item.currentPrice >= item.buy) {
        return 'text-right text-danger';
      }
      // 価格が下がっている -> 緑。
      return 'text-right text-success';

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
