<script setup lang="ts">
// import { onMounted } from 'vue'
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const isLoading = ref(false)

const responseUser = ref()
const responseAdvertiser = ref()

// Get the TikTok authorization URL
const loginWithTikTokUser = async (stop?: string) => {
  isLoading.value = true
  const response = await axios.get('https://vue-tiktok-login-server.onrender.com/oauth-user', {
    params: {
      state: stop ? 'stop' : null,
    }
  })
  console.log(`getAuthUrl's response:`, response)
  responseUser.value = response
  window.location.href = `${response.data.url}`
}

const loginWithTikTokAdvertiser = async (stop?: string) => {
  isLoading.value = true
  const response = await axios.get('https://vue-tiktok-login-server.onrender.com/oauth-advertiser', {
    params: {
      state: stop ? 'stop' : null,
    }
  })
  console.log(`getAuthUrl's response:`, response)
  responseAdvertiser.value = response
  window.location.href = `${response.data.url}`
}

async function handleTikTokUserRedirect() {
  const urlSearchParams = new URLSearchParams(window.location.search)
  const code = urlSearchParams.get('code')
  const scopes = urlSearchParams.get('scopes')
  const state = urlSearchParams.get('state')
  console.log('Authorization code:', code)
  console.log('Scopes:', scopes)
  console.log('State:', state)


  if (state?.includes('stop')) {
    return
  }
  if (code) {
    try {
      const response = await axios.post(
        'https://vue-tiktok-login-server.onrender.com/accesstoken-user',
        {
          code
        }
      )
      console.log(`response`, response)
      const accessToken = response.data.access_token
      console.log('Access Token:', accessToken)
      authStore.setAccessToken(accessToken)
      router.push('/user')
    } catch (error) {
      console.error('Error exchanging code for token:', error)
    }

    // Clear the code from the URL
    window.history.replaceState({}, document.title, window.location.pathname)
  }
}

async function handleTikTokAdvertiserRedirect() {
  const urlSearchParams = new URLSearchParams(window.location.search)
  const code = urlSearchParams.get('code')
  const scopes = urlSearchParams.get('scopes')
  const state = urlSearchParams.get('state')
  console.log('Authorization code:', code)
  console.log('Scopes:', scopes)
  console.log('State:', state)


  if (state?.includes('stop')) {
    return
  }
  if (code) {
    try {
      const response = await axios.post(
        'https://vue-tiktok-login-server.onrender.com/accesstoken-advertiser',
        {
          code
        }
      )
      console.log(`response`, response)
      const accessToken = response.data.access_token
      console.log('Access Token:', accessToken)
      console.log('advertiser_ids', response.data.advertiser_ids)
      console.log('scope', response.data.scope)
      authStore.setAccessToken(accessToken)
      router.push('/user')
    } catch (error) {
      console.error('Error exchanging code for token:', error)
    }

    // Clear the code from the URL
    window.history.replaceState({}, document.title, window.location.pathname)
  }
}

onMounted(() => {
  handleTikTokUserRedirect()
  handleTikTokAdvertiserRedirect()
})
</script>

<template>
  <div class="login">
    <h1 class="green">{{ "Login with Tiktok's " }}</h1>
    <div v-if="isLoading" class="loading-spinner"></div>
    <data v-else class="button-container">
      <button class="button-login" @click="loginWithTikTokUser()">
        TikTok account holder
      </button>
      <button class="button-login" @click="loginWithTikTokUser('stop')">
        TikTok account holder (stop at auth code)
      </button>
      <button class="button-login" @click="loginWithTikTokAdvertiser()">
        TikTok advertiser
      </button>
      <button class="button-login" @click="loginWithTikTokAdvertiser('stop')">
        TikTok advertiser (stop at auth code)
      </button>
    </data>
    <p>user: {{ responseUser.value }}</p>
    <p>advertiser: {{ responseAdvertiser.value }}</p>
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

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid $color-primary;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  height: 210px;
}

.button-login {
  padding: 0;
  margin: 0;
  border: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #000;
  background-color: #fff;
  height: 50px;
  width: 300px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 16px;

  &:hover {
    cursor: pointer;
  }
}
</style>
