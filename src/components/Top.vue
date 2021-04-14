<template>
  <div>
    <b-row>
      <b-col md="2" />
      <b-col md="8">
        <b-button
          :to="'/port'"
          variant="outline-primary"
          size="lg"
          block
        >
          <b-icon icon="journal-bookmark" />
          {{ $t('top.button1') }}
        </b-button>
        <b-button
          :to="'/realized'"
          variant="outline-primary"
          size="lg"
          block
        >
          <b-icon icon="calculator" />
          {{ $t('top.button2') }}
        </b-button>
        <b-button
          variant="outline-danger"
          size="lg"
          block
          class="mt-5"
          @click="onClickSignOutButton"
        >
          {{ $t('top.button3') }}
          <b-icon icon="box-arrow-right" />
        </b-button>
      </b-col>
      <b-col md="2" />
    </b-row>
  </div>
</template>

<script>
import Cookies from 'js-cookie';

export default {

  name: 'Top',

  data() {

    return {
    };

  },

  // NOTE: 定数にように利用する変数、 props から算出できる値は computed に定義するよう心がけます。
  computed: {

  },

  async mounted () {

    // 

  },

  // NOTE: 「methods に含めるのは template から利用する method のみ」原則を心がけます。
  methods: {

    onClickSignOutButton: function () {

      // 認証 token 削除と、サインインページへの移動。
      Cookies.remove('token');
      this.$router.push({ name: 'SignIn' });

    },

  },

}
</script>

<style scoped>
</style>
