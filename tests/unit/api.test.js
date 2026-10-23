import { afterEach, describe, expect, test } from 'vitest';
import { fetchPortfolio, fetchRealized, fetchUser, signIn } from '@/api';
import { mockApi } from './mockApi';

let mock;
afterEach(() => {
  expect(mock.unexpected).toEqual([]);
});

describe('API contract', () => {
  test('sends the JWT header to the configured base URL with a trailing slash path', async () => {
    mock = mockApi({ 'GET /api/v1/portfolio/7/': { status: 200, data: { tradings: [] } } });
    const result = await fetchPortfolio('token-abc', 7);
    expect(result).toEqual({ ok: true, status: 200, data: { tradings: [] } });
    const { config } = mock.calls[0];
    expect(config.baseURL).toBe('http://api.invalid');
    expect(config.headers.get('Authorization')).toBe('JWT token-abc');
    expect(config.headers.get('Content-Type')).toBe('application/json');
  });

  test('realized passes each as a query parameter', async () => {
    mock = mockApi({ 'GET /api/v1/realized/1/': { status: 200, data: {} } });
    await fetchRealized('t', 1, 'month');
    expect(mock.calls[0].config.params).toEqual({ each: 'month' });
  });

  test('user check hits /api/v1/user/{id}/', async () => {
    mock = mockApi({ 'GET /api/v1/user/3/': { status: 200, data: { hello: true } } });
    expect((await fetchUser('t', 3)).ok).toBe(true);
  });

  test('sign in posts the code as JSON without an Authorization header', async () => {
    mock = mockApi({ 'POST /api-token-auth/': { status: 200, data: { token: 'jwt' } } });
    const result = await signIn('my-code');
    expect(result.data).toEqual({ token: 'jwt' });
    const { config } = mock.calls[0];
    expect(JSON.parse(config.data)).toEqual({ code: 'my-code' });
    expect(config.headers.has('Authorization')).toBe(false);
  });

  test('HTTP errors resolve to ok=false with the status', async () => {
    mock = mockApi({ 'GET /api/v1/portfolio/1/': { status: 500 } });
    expect(await fetchPortfolio('t', 1)).toEqual({ ok: false, status: 500, data: null });
  });

  test('network/CORS errors resolve to ok=false with status 0 instead of throwing', async () => {
    mock = mockApi({ 'GET /api/v1/portfolio/1/': 'network-error' });
    expect(await fetchPortfolio('t', 1)).toEqual({ ok: false, status: 0, data: null });
  });
});
