<template>
  <div
    id="app"
    class="m-3"
  >
    <router-view />
    <b-row class="mt-5">
      <b-col md="4" />
      <b-col
        md="4"
        class="text-center"
      >
        <b-form-select
          v-model="$i18n.locale"
          :options="[
            { value: 'en', text: 'English' },
            { value: 'ja', text: '日本語で OK' },
          ]"
          size="sm"
        />
        <div>
          Copyright © 2021 All rights reserved, Yuu Eguci
        </div>
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
