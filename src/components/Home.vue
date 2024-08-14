<script setup lang="ts">
import { onMounted } from 'vue'
import axios from 'axios'

// Login with TikTok button click
function loginWithTikTok() {
  const clientKey = import.meta.env.VITE_TIKTOK_CLIENT_KEY
  const redirectUri = encodeURIComponent(import.meta.env.VITE_TIKTOK_REDIRECT_URI)
  const availableScopes = [
    'user.info.basic',
    'user.info.profile',
    'user.info.stats',
    'artist.certification.read',
    'artist.certification.update',
    'research.data.u18eu',
    'video.list'
  ]
  const scope = availableScopes.join(',')
  const csrfState = Math.random().toString(36).substring(2)
  const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&response_type=code&scope=${scope}&redirect_uri=${redirectUri}&state=${csrfState}`
  window.location.href = authUrl
}

// Handle the TikTok redirect
function handleTikTokRedirect() {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const scopes = urlParams.get('scopes')
  const state = urlParams.get('state')

  if (code) {
    exchangeCodeForToken(code)
    console.log('Authorization code:', code)
    console.log('Scopes:', scopes)
    console.log('State:', state)

    // remove the code from the URL
    window.history.replaceState({}, document.title, window.location.pathname)
  }
}

// Exchange the authorization code for an access token
async function exchangeCodeForToken(code: string) {
  try {
    const response = await axios.post('https://dev.vervesearch.com/_temp/tiktok-login/token', {
      code
    })
    console.log(`response`, response)
    const accessToken = response.data.data.access_token
    console.log('Access Token:', accessToken)
  } catch (error) {
    console.error('Error exchanging code for token:', error)
  }
}

onMounted(() => {
  handleTikTokRedirect()
})
</script>

<template>
  <div class="login">
    <h1 class="green">{{ 'Login' }}</h1>
    <button class="button-login" @click="loginWithTikTok">
      <img alt="Tiktok login button" class="logo" src="@/assets/button.svg" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

h1 {
  font-weight: 500;
  font-size: 3rem;
  position: relative;
  top: -10px;
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
  padding: 0;
  margin: 0;
  border: 0;
  display: flex;
  background-color: transparent;

  &:hover {
    cursor: pointer;
  }
}
</style>
