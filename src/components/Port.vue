<template>
  <div>
    <b-row>
      <b-col md="2">
      </b-col>
      <b-col md="8">
        <div>
          <b-button :to="'/'"
                    variant="outline-primary"
                    class="btn-circle"
                    size="lg">
            <b-icon icon="arrow-left" />
          </b-button>
        </div>
        <b-table
          hover
          small
          :items="mainTableItems"
          :filter="'meaninglessCriteria'"
          :filter-function="filterTable"
          :fields="visibleFields"
          ref="mainTable"
          sort-icon-left
          :responsive="true"
          class="text-nowrap mt-3"
        >
          <!-- NOTE: $t を使うため script 内ではなく template 内でラベルを定義しています。 -->
          <template v-slot:head(code)="">
            {{$t('port.label.code')}}
          </template>
          <template v-slot:head(name)="">
            {{$t('port.label.name')}}
          </template>
          <template v-slot:head(boughtAt)="">
            {{$t('port.label.boughtAt')}}
          </template>
          <template v-slot:head(buy)="">
            {{$t('port.label.buy')}}
          </template>
          <template v-slot:head(currentPrice)="">
            {{$t('port.label.currentPrice')}}
          </template>
          <template v-slot:head(profit)="">
            {{$t('port.label.profit')}}
          </template>
        </b-table>
      </b-col>
      <b-col md="2">
      </b-col>
    </b-row>
  </div>
</template>

<script>
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
        },
        {
          key: 'currentPrice',
          // NOTE: label はここでは定義しません。 i18n に対応するため template 内にひとつずつ定義します。
          sortable: true,
          visible: true,
        },
        {
          key: 'profit',
          // NOTE: label はここでは定義しません。 i18n に対応するため template 内にひとつずつ定義します。
          sortable: true,
          visible: true,
        },
      ],

    };

  },

  computed: {

    // NOTE: Checkbox が fields.visible(ユーザ定義)を切り替え、
    //       その変更を受けて本 computed.visibleFields が更新されます。
    //       b-table :fields="visibleFields" なので、 visible=true の fields のみが表示されることになります。
    visibleFields() {
      return this.innerFields.filter(field => field.visible)
    },

  },

  async mounted () {

    // 

  },

  methods: {

    // b-table の filter-function です。 true を返す行を表示します。
    // b-table に :filter 属性を設定しないと動作しません。
    filterTable: function (row, filter) {  // eslint-disable-line no-unused-vars

      // NOTE: 今回は filter が必要ない予定だけれど、まあ b-table のオマケとして記述してます。
      return true;

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
