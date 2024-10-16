<script>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken
    const appId = '7405027833598181392'
    const userInfo = ref(null)
    const tokenInfo = ref(null)
    const inputAppId = ref('')
    const inputAccessToken = ref('')

    const fetchUserInfo = async () => {
      if (accessToken) {
        try {
          const response = await axios.get(
            'https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url_100,display_name,username,bio_description',
            {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            }
          )
          userInfo.value = response.data.data.user
        } catch (error) {
          console.error('Error fetching user information:', error)
        }
      } else {
        console.error('Access Token is not available')
      }
    }

    const fetchTokenInfo = async () => {
      if (accessToken && inputAppId.value !== '') {
        console.log('using appId:', inputAppId.value !== '' ? inputAppId.value.toString() : appId)
        console.log('using accessToken:', inputAccessToken.value !== '' ? inputAccessToken.value : accessToken)
        try {
          const response = await axios.post(
            'https://business-api.tiktok.com/open_api/v1.3/tt_user/token_info/get/',
            {
              app_id: inputAppId.value !== '' ? inputAppId.value.toString() : appId,
              access_token: inputAccessToken.value !== '' ? inputAccessToken.value : accessToken
            },
            {
              headers: {
                "Content-Type": "application/json"
              }
            }
          )
          console.log(response)
          tokenInfo.value = response
        } catch (error) {
          console.error('Error fetching token information:', error)
        }
      } else {
        console.error('Access Token is not available')
      }
    }

    onMounted(() => {
      fetchUserInfo()
    })

    return {
      userInfo,
      tokenInfo,
      inputAccessToken,
      inputAppId,
      fetchTokenInfo
    }
  }
}
</script>

<template>
  <div class="user">
    <div>
      <div v-if="userInfo">
        <h1>Welcome {{ userInfo.username }}</h1>
        <p><strong>Display Name:</strong> {{ userInfo.display_name }}</p>
        <p><strong>Bio:</strong> {{ userInfo.bio_description }}</p>
        <p class="avatar">
          <strong>Profile Picture:</strong>
          <img :src="userInfo.avatar_url_100" alt="Profile Picture" />
        </p>
        <input type="text" v-model="inputAppId" placeholder="Enter app id" />
        <input type="text" v-model="inputAccessToken" placeholder="Enter access token" />
        <button @click="fetchTokenInfo">fetch Token Info</button>
        <p>{{ tokenInfo.value }}</p>
      </div>
      <div v-else>
        <h1>Please login</h1>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@media (min-width: 1024px) {
  .user {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }

  .avatar {
    display: flex;
    flex-direction: column;

    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
  }
}
</style>
