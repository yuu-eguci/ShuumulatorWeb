import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import Cookies from 'js-cookie';
import en from '@/locales/en.json';
import ja from '@/locales/ja.json';
import { clearNotifications } from '@/notify';
import { fakeJwt, mockApi, mountApp } from './helpers';

let mock;
let app;

beforeEach(() => {
  Cookies.remove('token');
  clearNotifications();
});

afterEach(() => {
  vi.useRealTimers();
  app?.wrapper.unmount();
  app = undefined;
  expect(mock.unexpected).toEqual([]);
});

const USER_OK = { 'GET /api/v1/user/1/': { status: 200, data: { hello: true } } };
const signedIn = (routes = {}) => {
  Cookies.set('token', fakeJwt(1));
  return mockApi({ ...USER_OK, ...routes });
};
const toasts = () => app.wrapper.findAll('[data-test="toast"]');
const route = () => app.router.currentRoute.value.name;

describe('router guard', () => {
  test('without a token it goes to SignIn without calling the API', async () => {
    mock = mockApi({});
    app = await mountApp('/');
    expect(route()).toBe('SignIn');
    expect(app.router.currentRoute.value.query).toEqual({});
    expect(mock.calls).toEqual([]);
  });

  test('a protected deep link is remembered as ?redirect= for after sign-in', async () => {
    mock = mockApi({});
    app = await mountApp('/realized?each=month');
    expect(route()).toBe('SignIn');
    expect(app.router.currentRoute.value.query).toEqual({ redirect: '/realized?each=month' });
  });

  test('an unknown path falls back to Top instead of a blank page', async () => {
    mock = signedIn();
    app = await mountApp('/no-such-page');
    expect(route()).toBe('Top');
  });

  test('403 from the user check clears the token and goes to SignIn', async () => {
    Cookies.set('token', fakeJwt(1));
    mock = mockApi({ 'GET /api/v1/user/1/': { status: 403 } });
    app = await mountApp('/');
    expect(route()).toBe('SignIn');
    expect(Cookies.get('token')).toBeUndefined();
  });

  test('a network error goes to SignIn with an error message instead of hanging', async () => {
    Cookies.set('token', fakeJwt(1));
    mock = mockApi({ 'GET /api/v1/user/1/': 'network-error' });
    app = await mountApp('/');
    expect(route()).toBe('SignIn');
    expect(toasts().at(-1).classes()).toContain('text-bg-danger');
  });

  test('a server error keeps the token, goes to SignIn and shows an error', async () => {
    Cookies.set('token', fakeJwt(1));
    mock = mockApi({ 'GET /api/v1/user/1/': { status: 500 } });
    app = await mountApp('/');
    expect(route()).toBe('SignIn');
    expect(Cookies.get('token')).toBe(fakeJwt(1));
    expect(toasts().at(-1).classes()).toContain('text-bg-danger');
  });

  test('a valid session stays on Top', async () => {
    mock = signedIn();
    app = await mountApp('/');
    expect(route()).toBe('Top');
  });
});

describe('locale', () => {
  test('English by default and switches to Japanese from the footer select', async () => {
    mock = signedIn();
    app = await mountApp('/');
    expect(app.wrapper.text()).toContain('View my portfolio');
    await app.wrapper.find('[data-test="locale"]').setValue('ja');
    expect(app.wrapper.text()).toContain('ポートフォリオを閲覧');
    expect(document.documentElement.lang).toBe('ja');
  });

  test('en and ja define the same keys', () => {
    const keys = (obj, prefix = '') => Object.entries(obj).flatMap(([k, v]) => (
      typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
    )).sort();
    expect(keys(ja)).toEqual(keys(en));
  });
});

describe('Port', () => {
  const tradings = [
    { code: '1001', name: 'Up', bought_at: '2021-04-01T09:00:00', buy: 999, current_price: 1000 },
    { code: '1002', name: 'Down', bought_at: '2021-04-02T09:00:00', buy: 1000, current_price: 999 },
  ];

  test('shows holdings newest first, colored by numeric price comparison', async () => {
    mock = signedIn({ 'GET /api/v1/portfolio/1/': { status: 200, data: { tradings } } });
    app = await mountApp('/port');
    const rows = app.wrapper.findAll('tbody tr');
    expect(rows.map((r) => r.find('td').text())).toEqual(['1002', '1001']);
    const up = rows[1].find('[data-test="current-price"]');
    expect(up.text()).toBe('1,000');
    expect(up.classes()).toContain('text-danger');
    expect(rows[0].find('[data-test="current-price"]').classes()).toContain('text-success');
    expect(rows[1].text()).toContain('2021-04-01');
    expect(app.wrapper.find('[data-test="loading"]').exists()).toBe(false);
  });

  test('clicking a sortable header sorts by that column', async () => {
    mock = signedIn({ 'GET /api/v1/portfolio/1/': { status: 200, data: { tradings } } });
    app = await mountApp('/port');
    await app.wrapper.find('th[data-test="sort-code"]').trigger('click');
    expect(app.wrapper.findAll('tbody tr').map((r) => r.find('td').text())).toEqual(['1001', '1002']);
  });

  test.each([[{ status: 500 }], ['network-error']])('API failure %j stops loading and shows an error', async (failure) => {
    mock = signedIn({ 'GET /api/v1/portfolio/1/': failure });
    app = await mountApp('/port');
    expect(app.wrapper.find('[data-test="loading"]').exists()).toBe(false);
    expect(toasts().at(-1).classes()).toContain('text-bg-danger');
    expect(app.wrapper.findAll('tbody tr [data-test="current-price"]')).toHaveLength(0);
  });
});

describe('Realized', () => {
  const realized = Array.from({ length: 14 }, (_, i) => ({ label: `L${i}`, gain: 0.5, lost: 0.25 }));
  const body = { user_id: 1, each: 'year', realized, win_rate: 0.456, total_gain: 0.1, total_lost: 0.3 };

  test('shows totals with a single sign and charts the last 12 periods', async () => {
    mock = signedIn({ 'GET /api/v1/realized/1/': { status: 200, data: body } });
    app = await mountApp('/realized');
    const text = (name) => app.wrapper.find(`[data-test="${name}"]`).text();
    expect(text('win-rate')).toContain('46%');
    expect(text('total-gain')).toContain('10');
    expect(text('total-lost')).toContain('30');
    expect(text('realized')).toContain('-20');
    expect(text('realized')).not.toContain('--');
    const chartData = app.wrapper.findComponent({ name: 'RealizedChart' }).props('chartData');
    expect(chartData.labels).toEqual(realized.slice(-12).map((x) => x.label));
    expect(chartData.datasets.map((d) => d.data[0])).toEqual([50, -25, 25]);
  });

  test('changing the scale refetches with each=<scale>', async () => {
    mock = signedIn({ 'GET /api/v1/realized/1/': (config) => ({ status: 200, data: { ...body, each: config.params.each } }) });
    app = await mountApp('/realized');
    await app.wrapper.find('[data-test="each"]').setValue('month');
    await flushPromises();
    expect(mock.calls.filter((c) => c.key === 'GET /api/v1/realized/1/').map((c) => c.config.params.each)).toEqual(['year', 'month']);
  });

  test.each([[{ status: 500 }], ['network-error']])('API failure %j stops loading and shows an error', async (failure) => {
    mock = signedIn({ 'GET /api/v1/realized/1/': failure });
    app = await mountApp('/realized');
    expect(app.wrapper.find('[data-test="loading"]').exists()).toBe(false);
    expect(app.wrapper.find('[data-test="each"]').attributes('disabled')).toBeUndefined();
    expect(toasts().at(-1).classes()).toContain('text-bg-danger');
  });
});

describe('SignIn', () => {
  const submit = async (code) => {
    await app.wrapper.find('[data-test="invitation-code"]').setValue(code);
    await app.wrapper.find('form').trigger('submit');
  };

  test('an accepted code stores the token and moves to Top after the unlock animation', async () => {
    mock = mockApi({ 'POST /api-token-auth/': { status: 200, data: { token: fakeJwt(1) } }, ...USER_OK });
    app = await mountApp('/signin');
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    await submit('the-code');
    await vi.advanceTimersByTimeAsync(3000);
    vi.useRealTimers();
    await flushPromises();
    expect(Cookies.get('token')).toBe(fakeJwt(1));
    expect(route()).toBe('Top');
  });

  test.each([
    ['/realized?each=month', 'Realized'],
    ['//evil.example', 'Top'],
    ['https://evil.example', 'Top'],
    ['/signin', 'Top'],
  ])('after sign-in ?redirect=%s goes to %s', async (redirect, expected) => {
    mock = mockApi({
      'POST /api-token-auth/': { status: 200, data: { token: fakeJwt(1) } },
      ...USER_OK,
      'GET /api/v1/realized/1/': { status: 200, data: { each: 'year', realized: [], win_rate: 0, total_gain: 0, total_lost: 0 } },
    });
    app = await mountApp(`/signin?redirect=${encodeURIComponent(redirect)}`);
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    await submit('the-code');
    await vi.advanceTimersByTimeAsync(3000);
    vi.useRealTimers();
    await flushPromises();
    expect(route()).toBe(expected);
    if (expected === 'Realized') {
      expect(app.router.currentRoute.value.fullPath).toBe('/realized?each=month');
    }
  });

  test.each([[{ status: 403 }, 'rejected'], ['network-error', 'reach']])('failure %j re-enables the input and explains why', async (failure, word) => {
    mock = mockApi({ 'POST /api-token-auth/': failure });
    app = await mountApp('/signin');
    await submit('wrong');
    await flushPromises();
    expect(app.wrapper.find('[data-test="invitation-code"]').attributes('disabled')).toBeUndefined();
    expect(toasts().at(-1).text()).toContain(word);
    expect(Cookies.get('token')).toBeUndefined();
    expect(route()).toBe('SignIn');
  });

  test('leaving during the unlock animation does not navigate afterwards', async () => {
    mock = mockApi({ 'POST /api-token-auth/': { status: 200, data: { token: fakeJwt(1) } } });
    app = await mountApp('/signin');
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    await submit('the-code');
    await vi.advanceTimersByTimeAsync(100);
    const push = vi.spyOn(app.router, 'push');
    app.wrapper.unmount();
    await vi.advanceTimersByTimeAsync(5000);
    expect(push).not.toHaveBeenCalled();
    app = undefined;
  });
});
