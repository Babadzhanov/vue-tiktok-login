<script>
import axios from 'axios'
import { onMounted } from 'vue'

export default {
  setup() {
    // Handle the TikTok redirect
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
  }
}
</script>

<template>
  <div class="user">
    <h1>Welcome User</h1>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  .user {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
