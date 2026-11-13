import { createApp } from 'vue';
import { createWebHistory } from 'vue-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import './style.css';
import App from './App.vue';
import { restorePagesRedirect } from './deepLink';
import { createAppI18n } from './i18n';
import { createAppRouter } from './router';

restorePagesRedirect(window.location, window.history, import.meta.env.BASE_URL);

createApp(App)
  .use(createAppRouter(createWebHistory(import.meta.env.BASE_URL)))
  .use(createAppI18n())
  .mount('#app');
