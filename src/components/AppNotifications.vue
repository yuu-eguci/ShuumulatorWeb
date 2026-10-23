<template>
  <div class="toast-container position-fixed top-0 end-0 p-3">
    <div
      v-for="n in notifications"
      :key="n.id"
      data-test="toast"
      class="toast show"
      :class="`text-bg-${VARIANTS[n.type]}`"
      :role="n.type === 'error' ? 'alert' : 'status'"
      @click="dismiss(n.id)"
    >
      <div class="toast-body">
        <i
          class="bi me-2"
          :class="ICONS[n.type]"
        />{{ $t(n.key) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { dismiss, notifications } from '../notify';

const VARIANTS = { info: 'info', success: 'success', error: 'danger' };
const ICONS = { info: 'bi-info-circle', success: 'bi-check-circle', error: 'bi-exclamation-triangle' };
</script>
