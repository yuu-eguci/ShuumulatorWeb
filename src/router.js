import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'Top',
    component: () => import('./components/Top.vue'),
    meta: {},
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import('./components/SignIn.vue'),
    meta: {},
  },
  {
    path: '/port',
    name: 'Port',
    component: () => import('./components/Port.vue'),
    meta: {},
  },
  {
    path: '/realized',
    name: 'Realized',
    component: () => import('./components/Realized.vue'),
    meta: {},
  },
];

const router = new Router({
  mode: 'history',
  routes,
});

// ページ遷移ごとに発生する処理です。
router.beforeEach(async (to, from, next) => {
  // next() は必須です。
  next();
});

export default router;
