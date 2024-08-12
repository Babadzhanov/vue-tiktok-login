<script>
import config from '@/config'

export default {
  methods: {
    loginWithTikTok() {
      const clientId = config.tiktok.id
      const redirectUri = encodeURIComponent('http://localhost:5173/user')
      const scope = 'user.info.basic'
      const responseType = 'code'
      const authUrl = `https://open-api.tiktok.com/platform/oauth/connect/?client_key=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`
      window.open(authUrl, '_blank')
    }
  }
}
</script>

<template>
  <div class="login">
    <h1 class="green">{{ 'Login' }}</h1>
    <button class="button-login" @click="loginWithTikTok">Login using TikTok</button>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h1,
  h3 {
    text-align: center;
  }
}

.button-login {
  padding: 15px 30px;
  margin: 0;
  border: 0;
  border-radius: 20px;
  color: #fff;
  font-weight: bold;
  background-color: #000;

  &:hover {
    cursor: pointer;
    background-color: $color-primary-hover;
  }
}
</style>
