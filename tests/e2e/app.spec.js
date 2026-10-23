import { expect, test } from '@playwright/test';

const API = 'http://api.invalid';
const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
const TOKEN = `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ user_id: 1, exp: 9999999999 })}.signature`;
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// localhost (vite preview) 以外への通信はすべて遮断し、http://api.invalid だけモックで応答します。
async function offlineApi(page) {
  const apiCalls = [];
  const blocked = [];
  await page.route('**/*', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.hostname === 'localhost') {
      return route.continue();
    }
    if (url.origin !== API) {
      blocked.push(url.href);
      return route.abort();
    }
    if (request.method() === 'OPTIONS') {
      return route.fulfill({ status: 204, headers: CORS });
    }
    apiCalls.push({ method: request.method(), path: url.pathname + url.search, auth: request.headers().authorization });
    const json = (status, body) => route.fulfill({ status, headers: CORS, json: body });
    const key = `${request.method()} ${url.pathname}`;
    if (key === 'POST /api-token-auth/') {
      return request.postDataJSON().code === 'the-code' ? json(200, { token: TOKEN }) : json(403, { detail: 'Authentication failed' });
    }
    if (request.headers().authorization !== `JWT ${TOKEN}`) {
      return json(403, { detail: 'Not authenticated' });
    }
    if (key === 'GET /api/v1/user/1/') {
      return json(200, { hello: true });
    }
    if (key === 'GET /api/v1/portfolio/1/') {
      return json(200, { tradings: [
        { code: '1001', name: 'Up', bought_at: '2021-04-01T09:00:00', buy: 999, current_price: 1000 },
        { code: '1002', name: 'Down', bought_at: '2021-04-02T09:00:00', buy: 1000, current_price: 999 },
      ] });
    }
    if (key === 'GET /api/v1/realized/1/') {
      const each = url.searchParams.get('each');
      return json(200, { user_id: 1, each, win_rate: 0.5, total_gain: 0.1, total_lost: 0.3, realized: [{ label: '2021', gain: 0.1, lost: 0.3 }] });
    }
    return json(404, {});
  });
  return { apiCalls, blocked };
}

test('built assets live under the /ShuumulatorWeb/ base path', async ({ request }) => {
  const html = await (await request.get('/ShuumulatorWeb/')).text();
  const urls = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
  expect(urls.length).toBeGreaterThan(1);
  for (const url of urls) {
    expect(url.startsWith('/ShuumulatorWeb/')).toBe(true);
  }
  expect((await request.get('/ShuumulatorWeb/404.html')).ok()).toBe(true);
});

test('sign in, browse portfolio and realized, switch locale, sign out (offline)', async ({ page }) => {
  const { apiCalls, blocked } = await offlineApi(page);

  await page.goto('/ShuumulatorWeb/');
  await expect(page).toHaveURL(/\/ShuumulatorWeb\/signin$/);

  const code = page.getByLabel('Invitation code');
  await code.fill('wrong');
  await code.press('Enter');
  await expect(page.getByText('Invitation code rejected.')).toBeVisible();
  await expect(code).toBeEnabled();

  await code.fill('the-code');
  await page.getByRole('button', { name: 'Unlock' }).click();
  await expect(page.getByRole('link', { name: 'View my portfolio' })).toBeVisible({ timeout: 10_000 });
  await expect(page).toHaveURL(/\/ShuumulatorWeb\/$/);

  await page.getByRole('link', { name: 'View my portfolio' }).click();
  const rows = page.locator('tbody tr');
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(0).locator('td').first()).toHaveText('1002');
  await expect(rows.nth(1).locator('[data-test="current-price"]')).toHaveClass(/text-danger/);
  await expect(rows.nth(0).locator('[data-test="current-price"]')).toHaveClass(/text-success/);

  await page.getByRole('link', { name: 'Back to top' }).click();
  await page.getByRole('link', { name: 'How is it going on so far?' }).click();
  await expect(page.locator('[data-test="realized"]')).toHaveText('Realized: -20YEN');
  await expect(page.locator('canvas')).toBeVisible();
  await page.locator('[data-test="each"]').selectOption('month');
  await expect.poll(() => apiCalls.some((c) => c.path === '/api/v1/realized/1/?each=month')).toBe(true);

  await page.getByLabel('Language').selectOption('ja');
  await expect(page.locator('[data-test="realized"]')).toHaveText('実現損益: -20円');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  await page.getByLabel('言語').selectOption('en');

  await page.reload();
  await expect(page).toHaveURL(/\/ShuumulatorWeb\/realized$/);
  await expect(page.locator('[data-test="realized"]')).toHaveText('Realized: -20YEN');

  await page.getByRole('link', { name: 'Back to top' }).click();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(/\/ShuumulatorWeb\/signin$/);
  expect(await page.context().cookies()).toEqual([]);

  expect(blocked).toEqual([]);
  for (const call of apiCalls.filter((c) => c.path !== '/api-token-auth/')) {
    expect(call.auth).toBe(`JWT ${TOKEN}`);
  }
  expect(apiCalls.find((c) => c.path === '/api-token-auth/').auth).toBeUndefined();
});

test('API outage shows an error and keeps the page usable', async ({ page, context }) => {
  await context.addCookies([{ name: 'token', value: TOKEN, url: 'http://localhost:4173' }]);
  const blocked = [];
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === 'localhost') {
      return route.continue();
    }
    blocked.push(url.href);
    return route.abort('connectionrefused');
  });
  await page.goto('/ShuumulatorWeb/port');
  await expect(page).toHaveURL(/\/ShuumulatorWeb\/signin$/);
  await expect(page.getByText('Could not reach the server.')).toBeVisible();
  await expect(page.getByLabel('Invitation code')).toBeEnabled();
  expect(blocked.every((url) => url.startsWith(API))).toBe(true);
});
