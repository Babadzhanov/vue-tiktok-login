const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(express.json())
app.use(cors())
app.use(express.static(__dirname))

app.post('/_temp/tiktok-login/token', async (req, res) => {
  const { code } = req.body
  const clientKey = 'sbawixotck9n8mqe9w'
  const clientSecret = 'dvi0ZWN7KAaHPtwl0McIJFWV8AilPVzN'
  const redirectUri = 'https://dev.vervesearch.com/_temp/tiktok-login/'

  console.log(`clientKey: ${clientKey}`)
  console.log(`clientSecret: ${clientSecret}`)
  console.log(`redirectUri: ${redirectUri}`)

  try {
    const response = await axios.post(
      'https://open.tiktokapis.com/v2/oauth/token/',
      new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache'
        }
      }
    )

    res.json(response.data)
  } catch (error) {
    console.error('Error exchanging code for token:', error)
    res.status(500).json({ error: 'Failed to exchange code for token' })
  }
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at https://dev.vervesearch.com/_temp/tiktok-login/token`)
})
