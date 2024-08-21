<script>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken
    const userInfo = ref(null)

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

    onMounted(() => {
      fetchUserInfo()
    })

    return {
      userInfo
    }
  }
}
</script>

<template>
  <div class="user">
    <div v-if="userInfo">
      <h1>Welcome {{ userInfo.username }}</h1>
      <p><strong>Display Name:</strong> {{ userInfo.display_name }}</p>
      <p><strong>Bio:</strong> {{ userInfo.bio_description }}</p>
      <p class="avatar">
        <strong>Profile Picture:</strong>
        <img :src="userInfo.avatar_url_100" alt="Profile Picture" />
      </p>
    </div>
    <div v-else>
      <h1>Please login</h1>
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
