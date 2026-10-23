import Cookies from 'js-cookie';

const COOKIE_NAME = 'token';

export const getToken = () => Cookies.get(COOKIE_NAME);
export const setToken = (token) => Cookies.set(COOKIE_NAME, token, { secure: true, sameSite: 'strict' });
export const clearToken = () => Cookies.remove(COOKIE_NAME);

// API の {id} に使う user_id を JWT の payload から取り出します。署名の検証はサーバ側の仕事です。
export function userIdFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replaceAll('-', '+').replaceAll('_', '/')));
    return Number.isSafeInteger(payload.user_id) && payload.user_id > 0 ? payload.user_id : null;
  } catch {
    return null;
  }
}

export function currentSession() {
  const token = getToken();
  return { token, userId: userIdFromToken(token) };
}
