import Cookies from 'js-cookie';

const COOKIE_NAME = 'token';

export const getToken = (): string | undefined => Cookies.get(COOKIE_NAME);
export const setToken = (token: string) => Cookies.set(COOKIE_NAME, token, { secure: true, sameSite: 'strict' });
export const clearToken = () => Cookies.remove(COOKIE_NAME);

// API の {id} に使う user_id を JWT の payload から取り出します。署名の検証はサーバ側の仕事です。
export function userIdFromToken(token: string | undefined): number | null {
  try {
    const { user_id: userId }: { user_id?: unknown } = JSON.parse(
      atob(token!.split('.')[1].replaceAll('-', '+').replaceAll('_', '/')),
    );
    return typeof userId === 'number' && Number.isSafeInteger(userId) && userId > 0 ? userId : null;
  } catch {
    return null;
  }
}

export function currentSession() {
  const token = getToken();
  return { token, userId: userIdFromToken(token) };
}
