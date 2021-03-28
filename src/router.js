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
  // NOTE: GitHub Pages で ...io/ShuumulatorWeb/ パスを使うときは、
  //       vue.config.js publicPath に加えてコレが必要です。
  // NOTE: ローカルで実行するときの動作が心配になるけれど、なんと問題ない。
  //       localhost/ShuumulatorWeb/ 下で実行される。驚き。
  base: '/ShuumulatorWeb/',
});

// ページ遷移ごとに発生する処理です。
router.beforeEach(async (to, from, next) => {
  // next() は必須です。
  next();
});

export default router;
