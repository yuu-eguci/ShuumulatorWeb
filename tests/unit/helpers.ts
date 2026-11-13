import { onTestFinished } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory } from 'vue-router';
import App from '@/App.vue';
import { createAppRouter } from '@/router';
import { createAppI18n } from '@/i18n';

export { fakeJwt, mockApi } from './mockApi';

// テストが終わったら、まだ unmount していなければ unmount します。
export async function mountApp(path: string) {
  const router = createAppRouter(createMemoryHistory());
  const i18n = createAppI18n();
  const wrapper = mount(App, {
    attachTo: document.body,
    global: { plugins: [router, i18n], stubs: { RealizedChart: true } },
  });
  onTestFinished(() => {
    if (!wrapper.vm.$.isUnmounted) {
      wrapper.unmount();
    }
  });
  await router.push(path);
  await flushPromises();
  return { wrapper, router, i18n };
}
