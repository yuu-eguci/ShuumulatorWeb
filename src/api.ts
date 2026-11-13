import axios, { type AxiosResponse } from 'axios';

// レスポンスの型は README の API 表のとおりです。サーバの値をそのまま信じず、呼び出し側でもチェックします。
export interface SignInResponse {
  token: string;
}

export interface Trading {
  code: string;
  name: string;
  bought_at: string;
  // DRF の DecimalField は文字列で届くことがあります。
  buy: number | string;
  current_price: number | string;
}

export interface PortfolioResponse {
  tradings: Trading[];
}

export type RealizedEach = 'year' | 'month' | 'week' | 'day';

export interface RealizedPeriod {
  label: string;
  gain: number;
  lost: number;
}

export interface RealizedResponse {
  user_id: number;
  each: RealizedEach;
  win_rate: number;
  total_gain: number;
  total_lost: number;
  realized: RealizedPeriod[];
}

export type ApiResult<T> = { ok: true; status: number; data: T } | { ok: false; status: number; data: null };

const createClient = (token?: string) => axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `JWT ${token}` } : {}),
  },
  responseType: 'json',
});

// 失敗しても throw せず {ok, status, data} を返します。通信エラー (CORS を含む) は status 0 です。
async function send<T>(request: Promise<AxiosResponse<T>>): Promise<ApiResult<T>> {
  try {
    const response = await request;
    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    return { ok: false, status: axios.isAxiosError(error) ? error.response?.status ?? 0 : 0, data: null };
  }
}

type Token = string | undefined;
type UserId = number | null;

export const signIn = (code: string) => send(createClient().post<SignInResponse>('/api-token-auth/', { code }));
export const fetchUser = (token: Token, userId: UserId) => send(createClient(token).get<unknown>(`/api/v1/user/${userId}/`));
export const fetchPortfolio = (token: Token, userId: UserId) => send(
  createClient(token).get<PortfolioResponse>(`/api/v1/portfolio/${userId}/`),
);
export const fetchRealized = (token: Token, userId: UserId, each: RealizedEach) => send(
  createClient(token).get<RealizedResponse>(`/api/v1/realized/${userId}/`, { params: { each } }),
);
