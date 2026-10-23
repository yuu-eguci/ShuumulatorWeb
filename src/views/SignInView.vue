<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div
        class="p-5 mb-4 rounded-3 text-light"
        :class="locked ? 'bg-info' : 'bg-success'"
      >
        <div class="text-center mb-4 display-4">
          <i
            data-test="lock-icon"
            class="bi border border-light rounded p-2"
            :class="locked ? ['bi-lock', unlocking ? 'shake' : 'fade-pulse'] : 'bi-unlock'"
          />
        </div>
        <p class="lead">
          <strong>Shuumulator-WEB |</strong>
          {{ $t('signin.lead') }}
        </p>
        <form
          class="d-flex gap-2"
          @submit.prevent="submit"
        >
          <input
            ref="input"
            v-model.trim="code"
            data-test="invitation-code"
            class="form-control form-control-lg"
            :aria-label="$t('signin.codeLabel')"
            autocomplete="off"
            :disabled="loading"
          >
          <button
            type="submit"
            class="btn btn-light btn-lg"
            :disabled="loading || !code"
          >
            {{ $t('signin.submit') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { signIn } from '../api';
import { setToken } from '../auth';
import { internalPath } from '../deepLink';
import { notify } from '../notify';

const ANIMATION_STEP_MS = 1500;

const router = useRouter();
const route = useRoute();
const input = ref(null);
const code = ref('');
const loading = ref(false);
const locked = ref(true);
const unlocking = ref(false);

let timer = null;
let unmounted = false;
// ページを離れたら timer を止めます。止めた wait は resolve されないので、その後の遷移も起きません。
const wait = (ms) => new Promise((resolve) => {
  timer = setTimeout(resolve, ms);
});

onMounted(() => input.value.focus());
onBeforeUnmount(() => {
  unmounted = true;
  clearTimeout(timer);
});

async function submit() {
  if (loading.value || !code.value) {
    return;
  }
  loading.value = true;
  notify('info', 'notify.verifying');

  const result = await signIn(code.value);
  if (unmounted) {
    return;
  }
  if (!result.ok || typeof result.data?.token !== 'string') {
    notify('error', result.status === 0 ? 'notify.networkError' : 'notify.signInRejected');
    loading.value = false;
    await nextTick();
    input.value?.focus();
    return;
  }

  // サインイン成功。ロックアイコンを揺らしてアンロックを見せてから遷移します。
  setToken(result.data.token);
  unlocking.value = true;
  await wait(ANIMATION_STEP_MS);
  locked.value = false;
  notify('success', 'notify.signInSucceeded');
  await wait(ANIMATION_STEP_MS);
  router.push(destination());
}

// ?redirect= がアプリ内の別ページならそこへ、それ以外は Top へ戻ります。
function destination() {
  const path = internalPath(route.query.redirect);
  const name = path && router.resolve(path).name;
  return name && name !== 'SignIn' ? path : { name: 'Top' };
}
</script>
