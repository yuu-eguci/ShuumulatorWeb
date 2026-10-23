import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';

export default [
  { ignores: ['dist/', 'dist-e2e/', 'playwright-report/', 'test-results/'] },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
    },
  },
  {
    files: ['*.config.js', 'scripts/**', 'tests/**'],
    languageOptions: { globals: { ...globals.node } },
  },
];
