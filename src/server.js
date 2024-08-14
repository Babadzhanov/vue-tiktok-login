import express from 'express'
import axios from 'axios'
import config from './config'

const app = express()

app.get('/callback', async (req, res) => {
  const code = req.query.code

  if (!code) {
    return res.status(400).send('No code found in URL')
  }

  try {
    const accessToken = await getAccessToken(code)
    const userInfo = await getUserInfo(accessToken)

    // Handle user information (e.g., store in database, create session, etc.)
    res.json(userInfo)
  } catch (error) {
    console.error('Error retrieving user information:', error)
    res.status(500).send('Internal Server Error')
  }
})

async function getAccessToken(code) {
  const response = await axios.post('https://open-api.tiktok.com/oauth/access_token/', {
    client_key: config.tiktok.id,
    client_secret: config.tiktok.secret,
    code: code,
    grant_type: 'authorization_code'
  })

  return response.data.data.access_token
}

async function getUserInfo(accessToken) {
  const response = await axios.get('https://open-api.tiktok.com/user/info/', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return response.data.data
}

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
