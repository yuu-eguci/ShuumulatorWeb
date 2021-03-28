<template>
  <div>
    <b-row>
      <b-col md="2">
      </b-col>
      <b-col md="8">
        <b-button :to="'/port'"
                  variant="outline-primary"
                  size="lg"
                  block>
          ポートフォリオを閲覧
        </b-button>
        <b-button :to="'/realized'"
                  variant="outline-primary"
                  size="lg"
                  block>
          今んとこどんな感じ?
        </b-button>
        <b-button variant="outline-danger"
                  size="lg"
                  block
                  class="mt-5">
          サインアウト
        </b-button>
      </b-col>
      <b-col md="2">
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {

  name: 'Top',

  data() {

    return {
    };

  },

  async mounted () {

    // 

  },

  methods: {

  },

}
</script>

<style scoped>
</style>
