import Vue from 'vue'
import App from './App.vue'
import i18n from './i18n'
import router from './router';

Vue.config.productionTip = false

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
