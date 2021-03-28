import Vue from 'vue'
import App from './App.vue'
import i18n from './i18n'
import router from './router';

Vue.config.productionTip = false

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
