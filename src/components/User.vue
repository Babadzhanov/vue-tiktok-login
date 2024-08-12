<script>
export default {
  data() {
    return {
      error: null,
      user: null
    }
  },
  async created() {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    if (code) {
      try {
        const response = await fetch('http://localhost:3000/exchange_code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ code })
        })
        const data = await response.json()
        console.log(`data`, data)
        if (data.error) {
          this.error = data.error
        } else {
          this.user = data.user
        }
      } catch (err) {
        this.error = 'An error occurred while logging in.'
      }
    } else {
      this.error = 'No authorization code found.'
    }
  }
}
</script>

<template>
  <div>
    <p v-if="error">{{ error }}</p>
    <p v-else-if="user">Welcome, {{ user.display_name }}</p>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
