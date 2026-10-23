<template>
  <div class="row justify-content-center">
    <div class="col-md-8 d-grid gap-2">
      <RouterLink
        to="/port"
        class="btn btn-outline-primary btn-lg"
      >
        <i class="bi bi-journal-bookmark" />
        {{ $t('top.button1') }}
      </RouterLink>
      <RouterLink
        to="/realized"
        class="btn btn-outline-primary btn-lg"
      >
        <i class="bi bi-calculator" />
        {{ $t('top.button2') }}
      </RouterLink>
      <button
        type="button"
        class="btn btn-outline-danger btn-lg mt-5"
        @click="signOut"
      >
        {{ $t('top.button3') }}
        <i class="bi bi-box-arrow-right" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { clearToken } from '../auth';
import { notify } from '../notify';

const router = useRouter();

function signOut() {
  clearToken();
  notify('success', 'notify.signedOut');
  router.push({ name: 'SignIn' });
}
</script>
