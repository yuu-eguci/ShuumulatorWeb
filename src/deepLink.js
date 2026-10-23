// アプリ内のパス ("/" で始まり、"//" や "/\" で始まらず、制御文字を含まない) だけを通します。
// 外部 URL へのリダイレクトを防ぐためです。
const hasControlCharacter = (value) => [...value].some((c) => c.charCodeAt(0) < 0x20 || c.charCodeAt(0) === 0x7f);

export function internalPath(value) {
  return typeof value === 'string' && /^\/(?![/\\])/.test(value) && !hasControlCharacter(value) ? value : null;
}

// 404.html が ?p= に入れた元のパスを取り出します。
export function pathFromPagesRedirect(search) {
  return internalPath(new URLSearchParams(search).get('p'));
}

// ?p= があれば、ルーターの起動前に元の URL に戻します。
export function restorePagesRedirect(location, history, base) {
  const path = pathFromPagesRedirect(location.search);
  if (path) {
    history.replaceState(history.state, '', base.replace(/\/$/, '') + path);
  }
}
