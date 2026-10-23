# syntax=docker/dockerfile:1
# Node.js のバージョンは .nvmrc と同じにします (scripts/runtime-alignment.test.js でチェック)。
ARG NODE_VERSION=24.22.1

FROM node:${NODE_VERSION}-trixie-slim@sha256:43b9ba1142b8dcf33fa8f922ca1be85714adc444e0586c7cf7726daaeabc1bea AS deps
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# docker build --target test . で lint、unit テスト、ランタイムチェック、ビルドを実行します。
FROM deps AS test
COPY . .
RUN npm run lint && npm test && npm run build

FROM deps AS build
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.30-alpine@sha256:f5116ed4606f3eb015dd4a8e28cb9b351476dc0ad4bc6e9f93b19cec130cdf03 AS web
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html/ShuumulatorWeb
EXPOSE 8080
