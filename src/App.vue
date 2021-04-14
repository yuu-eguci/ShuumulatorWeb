<template>
  <div
    id="app"
    class="m-3"
  >
    <router-view />
    <b-row class="mt-5">
      <b-col md="4" />
      <b-col md="4">
        <b-form-select
          v-model="$i18n.locale"
          :options="[
            { value: 'en', text: 'English' },
            { value: 'ja', text: '日本語で OK' },
          ]"
          size="sm"
        />
      </b-col>
      <b-col md="4" />
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
</style>
