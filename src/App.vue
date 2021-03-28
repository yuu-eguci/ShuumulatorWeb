<template>
  <div id="app" class="m-3">
    <router-link :to="'/signin'">SignIn</router-link>
    <b-form-select v-model="$i18n.locale" :options="['en', 'ja']" size="sm" />
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
</style>
