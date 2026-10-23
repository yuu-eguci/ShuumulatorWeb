import axios from 'axios';

const createClient = (token) => axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `JWT ${token}` } : {}),
  },
  responseType: 'json',
});

// 失敗しても throw せず {ok, status, data} を返します。通信エラー (CORS を含む) は status 0 です。
async function send(request) {
  try {
    const response = await request;
    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    return { ok: false, status: error.response?.status ?? 0, data: null };
  }
}

export const signIn = (code) => send(createClient().post('/api-token-auth/', { code }));
export const fetchUser = (token, userId) => send(createClient(token).get(`/api/v1/user/${userId}/`));
export const fetchPortfolio = (token, userId) => send(createClient(token).get(`/api/v1/portfolio/${userId}/`));
export const fetchRealized = (token, userId, each) => send(
  createClient(token).get(`/api/v1/realized/${userId}/`, { params: { each } }),
);
