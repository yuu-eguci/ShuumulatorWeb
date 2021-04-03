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
