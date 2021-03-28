<template>
  <div>
    <b-row>
      <b-col md="2">
      </b-col>
      <b-col md="8">
        <b-jumbotron :bg-variant="locked ? 'info' : 'success'" text-variant="light">
          <template #header>
            <div class="text-center">
              <b-icon v-if="locked"
                      icon="lock"
                      class="border border-light rounded p-2"
                      :animation="iconAnimation"
                      font-scale="2" />
              <b-icon v-else
                      icon="unlock"
                      class="border border-light rounded p-2"
                      font-scale="2" />
            </div>
          </template>

          <template #lead>
            This page is solidly locked. Type your invitation code.
          </template>

          <p>
            <b-form-input v-model="invitationCode"
                          @input="inspectInvitationCode"
                          :disabled="loading"
                          ref="focusThis"
                          size="lg" />
          </p>
        </b-jumbotron>
      </b-col>
      <b-col md="2">
      </b-col>
    </b-row>
  </div>
</template>

<script>
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

    inspectInvitationCode: function () {

      console.info(this.invitationCode);

      // コードには everybody-dance-now を認めている。
      if (this.invitationCode === 'everybody-dance-now') {
      // if (this.invitationCode === 'aaaa') {

        // ロックアイコンをアニメートしたあと遷移します。

        // TODO: JWT を実装。

        this.animateUnlock();

      }

    },

    animateUnlock: function () {

      console.info('animateUnlock');

      // Disable input.
      this.loading = true;

      // ロック状態のアイコンを揺らす。
      this.iconAnimation = 'cylon';

      // ロック -> アンロックアイコンにチェンジ。
      setTimeout(() => {
        this.locked = false;

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
