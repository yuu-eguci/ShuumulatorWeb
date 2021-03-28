import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'HelloWorld',
    component: () => import('./components/HelloWorld.vue'),
    meta: {},
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import('./components/SignIn.vue'),
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
