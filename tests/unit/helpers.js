import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory } from 'vue-router';
import App from '@/App.vue';
import { createAppRouter } from '@/router';
import { createAppI18n } from '@/i18n';

export { fakeJwt, mockApi } from './mockApi';

export async function mountApp(path) {
  const router = createAppRouter(createMemoryHistory());
  const i18n = createAppI18n();
  const wrapper = mount(App, {
    attachTo: document.body,
    global: { plugins: [router, i18n], stubs: { RealizedChart: true } },
  });
  await router.push(path);
  await flushPromises();
  return { wrapper, router, i18n };
}
