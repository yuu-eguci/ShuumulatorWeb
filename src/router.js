import Vue from 'vue';
import Router from 'vue-router';
import Cookies from 'js-cookie'
import axiosUtils from '@/utils/axiosUtils';

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
    meta: { isPublic: true },
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

  // isPublic ページでは何もチェックを行いません。
  const isPublic = to.matched.some(record => record.meta.isPublic);
  if (isPublic) {
    return next();
  }

  // cookie から jwt token を取得します。
  const token = Cookies.get('token');
  console.info({ token });

  // なけりゃさっさと SignIn へ。
  if (!token) {
    return next({ name: 'SignIn' });
  }

  // jwt 認証に通っているかチェックを行います。
  // NOTE: ろくでもないざっくり実装です。
  const axiosInstance = axiosUtils.createAxiosInstance(token);
  const response = await axiosInstance.get('/api/v1/user/1/').catch(err => {
    return err.response;
  });
  if (response.status !== 200) {
    // 非ログイン時には 403 が発生します。
    return next({ name: 'SignIn' });
  }

  // next() は必須です。
  next();
});

export default router;
