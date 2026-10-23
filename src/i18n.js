import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import ja from './locales/ja.json';

export const createAppI18n = () => createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en, ja },
});
