import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

export interface MockResponse {
  status: number;
  data?: unknown;
}

type MockRoute = MockResponse | 'network-error' | ((config: InternalAxiosRequestConfig) => MockResponse);

export interface MockCall {
  key: string;
  config: InternalAxiosRequestConfig;
}

// 'METHOD /path/' をキーにしたレスポンス定義で axios の adapter を差し替えます。
// 定義にないリクエストは unexpected に記録して、テスト側で失敗させます。
export function mockApi(routes: Record<string, MockRoute>) {
  const calls: MockCall[] = [];
  const unexpected: string[] = [];
  axios.defaults.adapter = async (config) => {
    const key = `${config.method!.toUpperCase()} ${config.url}`;
    calls.push({ key, config });
    if (!(key in routes)) {
      unexpected.push(key);
      throw new AxiosError('Unexpected request', AxiosError.ERR_NETWORK, config);
    }
    const route = typeof routes[key] === 'function' ? routes[key](config) : routes[key];
    if (route === 'network-error') {
      throw new AxiosError('Network Error', AxiosError.ERR_NETWORK, config);
    }
    const response: AxiosResponse = { data: route.data ?? null, status: route.status, statusText: '', headers: {}, config, request: {} };
    if (route.status >= 200 && route.status < 300) {
      return response;
    }
    throw new AxiosError(`Request failed with status code ${route.status}`, AxiosError.ERR_BAD_RESPONSE, config, {}, response);
  };
  return { calls, unexpected };
}

export type ApiMock = ReturnType<typeof mockApi>;

// payload が {user_id} の、署名なしのダミー JWT です。
export function fakeJwt(userId = 1) {
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ user_id: userId, exp: 9999999999 })}.signature`;
}
