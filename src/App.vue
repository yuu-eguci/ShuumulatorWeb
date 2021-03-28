<template>
  <div id="app" class="m-3">
    <router-link :to="'/signin'">SignIn</router-link>
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
