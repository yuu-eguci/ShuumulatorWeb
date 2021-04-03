module.exports = {

    // XXX: ./node_modules/.bin/eslint --config .eslintrc.js . が plugin:vue を無視しやがる。なぜ? わからない。
    //      plugin:vue の lint を行うときは↓のいずれかを使うほかない。
    //      vscode はちゃんと plugin:vue を表示してくれてる。
    //      yarn lint も plugin:vue に反応する。
    // NOTE: yarn lint は自動で auto fix が走る。嫌なら yarn lint --no-fix を使うこと。

    "root": true,
    // env: 静的検証の前提条件
    //      brwoser -> document, onload 等ブラウザのグローバル変数を有効にする。
    //      node -> require 等が定義される
    //      es6 -> ES6 の構文が有効になる。ただし ES Modules 機能は有効にならない。 parserOptions.sourceType で定義して。
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
    },
    // NOTE: サードパーティやESLintが推奨するベースのルールを設定する。
    "extends": [
        "eslint:recommended",
        "plugin:vue/recommended"
    ],
    // NOTE: 有効にするグローバル変数。
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        // NOTE: ECMAScript の構文を有効にする。
        "ecmaVersion": 2018,
        // NOTE: env.es6=true だけでは有効にならない ES Modules を有効にする。
        //       コードを module として扱うと予約語が増えたり強制的に strict mode になったりする。
        //       既存コードを module として扱うと壊れる可能性があるため、 env.es6 とは別定義になっている。
        "sourceType": "module",
        // NOTE: import とか? を有効にする設定。
        //       vue-cli の初期設定でついてくる。
        "parser": "babel-eslint",
    },
    // NOTE: サードパーティによって定義されたルールを有効にする。
    "plugins": [
        "vue"
    ],
    // NOTE: 何かを有効にしたり、無効にしたり。あまり特別ルールは足したくないね。
    "rules": {
    }
};
