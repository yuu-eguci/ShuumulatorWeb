# ShuumulatorWeb

Shuumulator のポートフォリオと実現損益を表示する Web アプリだよ。

- Docker: 対応!
- Runtime: Node.js 24.22.1 (LTS)。`.nvmrc`、`package.json` (`engines` / `volta`)、`Dockerfile`、GitHub Actions で同じバージョンを使う
- Framework: Vue 3 + Vite 8、vue-router 5、vue-i18n 11、Bootstrap 5、Chart.js 4、axios
- Lint: ESLint 10 (flat config) + eslint-plugin-vue
- Test: Vitest + Vue Test Utils (unit)、Playwright (ブラウザ)。API はすべてオフラインの mock を使う
- Package manager: npm (`package-lock.json` + `npm ci`)

## GitHub Pages

[https://yuu-eguci.github.io/ShuumulatorWeb/](https://yuu-eguci.github.io/ShuumulatorWeb/)

## パッと実行してみたい

### Docker

```bash
# lint、unit テスト、ランタイムチェック、ビルドをコンテナ内で実行
docker build --target test -t shuumulator-web:test .

# ビルドした静的ファイルを nginx で配信
docker build -t shuumulator-web .
docker run --rm -p 8080:8080 shuumulator-web
# http://localhost:8080/ShuumulatorWeb/
```

### ローカル

Node.js 24.22.1 を使う。
Volta は自動で切り替わる。
nvm なら `nvm use` を実行してね。

```bash
npm ci
npm run dev          # http://localhost:8080/ShuumulatorWeb/ (API は http://localhost:8000)
npm run lint
npm test             # Vitest + ランタイムのバージョンチェック
npx playwright install chromium   # 初回だけ
npm run test:e2e     # ビルドしたアプリをブラウザで操作 (API はモック)
npm run build        # dist/ に出力
```

## API

バックエンドは Django REST framework 製の ShuumulatorApi だよ。
接続先は `.env.development` (ローカル) と `.env.production` (本番) の `VITE_API_BASE_URL` で決まる。

| メソッド | パス | 用途 |
|---|---|---|
| POST | `/api-token-auth/` | 招待コード `{code}` を送って `{token}` (JWT) をもらう |
| GET | `/api/v1/user/{id}/` | サインイン済みかチェック (未サインインだと 403) |
| GET | `/api/v1/portfolio/{id}/` | 保有銘柄 `{tradings: [...]}` |
| GET | `/api/v1/realized/{id}/?each=year\|month\|week\|day` | 実現損益と勝率 |

- 認証ヘッダは `Authorization: JWT <token>`。
- トークンは cookie `token` に保存する。
- `{id}` は JWT の `user_id` から取る。
- 招待コードのチェックはサーバ側だけで行う。
- テストは本物の API に接続しない。
- unit テストは axios の adapter を mock に置き換える。
- e2e テストは Playwright が `http://api.invalid` へのリクエストに応答する。
- e2e テストでは、それ以外の外部通信を遮断する。

## 公開

`main` への push で CI (lint、テスト、e2e、ビルド、Docker ビルド) が走る。
すべて通ったときだけ `GITHUB_TOKEN` で `gh-pages` ブランチに公開する。
PR では公開しない。
