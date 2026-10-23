import { createRouter } from 'vue-router';
import { fetchUser } from './api';
import { clearToken, currentSession } from './auth';
import { notify } from './notify';

const routes = [
  { path: '/', name: 'Top', component: () => import('./views/TopView.vue') },
  { path: '/signin', name: 'SignIn', component: () => import('./views/SignInView.vue'), meta: { isPublic: true } },
  { path: '/port', name: 'Port', component: () => import('./views/PortView.vue') },
  { path: '/realized', name: 'Realized', component: () => import('./views/RealizedView.vue') },
];

export function createAppRouter(history) {
  const router = createRouter({ history, routes });

  // ページ遷移ごとに、サインイン済みかを API でチェックします。
  router.beforeEach(async (to) => {
    if (to.meta.isPublic) {
      return true;
    }
    const { token, userId } = currentSession();
    if (!userId) {
      clearToken();
      return { name: 'SignIn' };
    }
    const result = await fetchUser(token, userId);
    if (result.ok) {
      return true;
    }
    if (result.status === 0) {
      notify('error', 'notify.networkError');
    } else if (result.status === 401 || result.status === 403) {
      clearToken();
    } else {
      notify('error', 'notify.loadFailed');
    }
    return { name: 'SignIn' };
  });

  return router;
}
