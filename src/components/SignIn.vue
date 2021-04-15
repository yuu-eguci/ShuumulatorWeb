<template>
  <div>
    <b-row>
      <b-col md="2" />
      <b-col md="8">
        <b-jumbotron
          :bg-variant="locked ? 'info' : 'success'"
          text-variant="light"
        >
          <template #header>
            <div class="text-center">
              <b-icon
                v-if="locked"
                icon="lock"
                class="border border-light rounded p-2"
                :animation="iconAnimation"
                font-scale="2"
              />
              <b-icon
                v-else
                icon="unlock"
                class="border border-light rounded p-2"
                font-scale="2"
              />
            </div>
          </template>

          <template #lead>
            <strong>
              Shuumulator-WEB |
            </strong>
            {{ $t('signin') }}
          </template>

          <p>
            <b-form-input
              ref="focusThis"
              v-model="invitationCode"
              :disabled="loading"
              autocomplete="off"
              size="lg"
              @input="inspectInvitationCode"
            />
          </p>
        </b-jumbotron>
      </b-col>
      <b-col md="2" />
    </b-row>
  </div>
</template>

<script>
import axiosUtils from '@/utils/axiosUtils';
import Cookies from 'js-cookie';
import pnotifyUtils from '@/utils/pnotifyUtils';

export default {

  name: 'SignIn',

  data() {

    return {
      invitationCode: '',

      // 演出のための data です。
      loading: false,
      iconAnimation: 'fade',
      locked: true,
    };

  },

  async mounted () {

    this.$refs.focusThis.focus();

  },

  methods: {

    inspectInvitationCode: async function () {

      // コードには everybody-dance-now を認めている。
      if (this.invitationCode === 'everybody-dance-now') {

        pnotifyUtils.popHidingNotice('Invitation code accepted. Verifying...');

        // Disable input.
        this.loading = true;

        // ロックアイコンをアニメートしたあと遷移します。

        // これを再現したいんだけど -d の部分がどうしても Django へ渡らない……。
        // curl -X POST -d "code=everybody-dance-now" http://localhost:8000/api-token-auth/
        // Django に json で post しても受け付けてくれない。
        // ↓
        // application/x-www-form-urlencoded でおくんないとだめだったか。
        // axios で application/x-www-form-urlencoded を送るときは URLSearchParams を使わないとだめ。
        // ↓
        // 渡らない理由は Django 側で json post を受け付けなかったからだった。
        const axiosInstance = axiosUtils.createAxiosInstance();
        const response = await axiosInstance.post(`/api-token-auth/`, {
          code: this.invitationCode,
        }).catch(err => {
          return err.response;
        });
        // NOTE: CORS でひっかかると response が undefined。
        if (response.status !== 200) {
          console.error(response);
          return;
        }
        // サインインに成功すると {token: jwt token} が返ってきます。
        // Cookie に保存する。
        Cookies.set('token', response.data.token, { secure: true });

        this.animateUnlock();

      }

    },

    animateUnlock: function () {

      // Disable input.
      this.loading = true;

      // ロック状態のアイコンを揺らす。
      this.iconAnimation = 'cylon';

      // ロック -> アンロックアイコンにチェンジ。
      setTimeout(() => {
        this.locked = false;

        pnotifyUtils.popHidingSuccess('SignIn succeeded.');

        // アンロックアイコンを見せたあと、遷移します。
        setTimeout(() => {
          this.$router.push({ path: '/' });
        }, 1500);

      }, 1500);

    },

  },

}
</script>

<style scoped>
</style>
