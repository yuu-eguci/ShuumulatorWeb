<template>
  <div class="m-3">
    <RouterView />
    <div class="row mt-5 justify-content-center">
      <div class="col-md-4 text-center">
        <select
          v-model="locale"
          data-test="locale"
          class="form-select form-select-sm"
          :aria-label="$t('common.language')"
        >
          <option value="en">
            English
          </option>
          <option value="ja">
            日本語で OK
          </option>
        </select>
        <div>Copyright © 2021 All rights reserved, Yuu Eguci</div>
      </div>
    </div>
    <AppNotifications />
  </div>
</template>

<script setup>
import { watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import AppNotifications from './components/AppNotifications.vue';

const { locale } = useI18n({ useScope: 'global' });

watchEffect(() => {
  document.documentElement.lang = locale.value;
});
</script>
