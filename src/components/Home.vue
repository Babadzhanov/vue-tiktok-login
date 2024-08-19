<script setup lang="ts">
// import { onMounted } from 'vue'
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const isLoading = ref(false)

// Get the TikTok authorization URL
const loginWithTikTok = async () => {
  isLoading.value = true
  const response = await axios.get('https://vue-tiktok-login-server.onrender.com/oauth')
  console.log(`getAuthUrl's response:`, response)
  window.location.href = `${response.data.url}`
}

async function handleTikTokRedirect() {
  const urlSearchParams = new URLSearchParams(window.location.search)
  const code = urlSearchParams.get('code')
  const scopes = urlSearchParams.get('scopes')
  const state = urlSearchParams.get('state')
  console.log('Authorization code:', code)
  console.log('Scopes:', scopes)
  console.log('State:', state)

  if (code) {
    try {
      const response = await axios.post(
        'https://vue-tiktok-login-server.onrender.com/accesstoken',
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

onMounted(() => {
  handleTikTokRedirect()
})
</script>

<template>
  <div class="login">
    <h1 class="green">{{ 'Login' }}</h1>
    <div v-if="isLoading" class="loading-spinner"></div>
    <button v-else class="button-login" @click="loginWithTikTok">
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
