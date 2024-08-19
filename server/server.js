const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
const cors = require('cors')
const querystring = require('node:querystring')
const cookieParser = require('cookie-parser')

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(express.json())
app.use(cors())
app.use(express.static(__dirname))
app.use(cookieParser())

app.get('/oauth', (req, res) => {
  console.log(`Received GET request at: ${req.originalUrl}`)
  const clientKey = 'sbawixotck9n8mqe9w'
  const redirectUri = 'https://dev.vervesearch.com/_temp/tiktok-login/'
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
  res.cookie('csrfState', csrfState, { maxAge: 60000 })
  let url = 'https://www.tiktok.com/v2/auth/authorize/'
  url += `?client_key=${clientKey}`
  url += `&scope=${scope}`
  url += '&response_type=code'
  url += `&redirect_uri=${redirectUri}`
  url += '&state=' + csrfState
  res.json({ url: url })
})

app.post('/accesstoken', async (req, res) => {
  console.log(`Received POST request at: ${req.originalUrl}`)
  try {
    const clientKey = 'sbawixotck9n8mqe9w'
    const clientSecret = 'dvi0ZWN7KAaHPtwl0McIJFWV8AilPVzN'
    const redirectUri = 'https://dev.vervesearch.com/_temp/tiktok-login/'
    console.log(`clientKey: ${clientKey}`)
    console.log(`clientSecret: ${clientSecret}`)
    console.log(`redirectUri: ${redirectUri}`)
    const { code } = req.body
    const decode = decodeURI(code)
    const tokenEndpoint = 'https://open.tiktokapis.com/v2/oauth/token/'
    const params = {
      client_key: clientKey,
      client_secret: clientSecret,
      code: decode,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    }
    const response = await axios.post(tokenEndpoint, querystring.stringify(params), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache'
      }
    })
    console.log('response:', response)
    res.send(response.data)
  } catch (error) {
    console.error('Error during callback:', error.message)
    res.status(500).send('An error occurred during the login process.')
  }
})

//-
// app.post('/_temp/tiktok-login/token', async (req, res) => {
//   const { code } = req.body
//   const clientKey = 'sbawixotck9n8mqe9w'
//   const clientSecret = 'dvi0ZWN7KAaHPtwl0McIJFWV8AilPVzN'
//   const redirectUri = 'https://dev.vervesearch.com/_temp/tiktok-login/'

//   console.log(`clientKey: ${clientKey}`)
//   console.log(`clientSecret: ${clientSecret}`)
//   console.log(`redirectUri: ${redirectUri}`)

//   try {
//     const response = await axios.post(
//       'https://open.tiktokapis.com/v2/oauth/token/',
//       new URLSearchParams({
//         client_key: clientKey,
//         client_secret: clientSecret,
//         code: code,
//         grant_type: 'authorization_code',
//         redirect_uri: redirectUri
//       }),
//       {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'Cache-Control': 'no-cache'
//         }
//       }
//     )

//     res.json(response.data)
//   } catch (error) {
//     console.error('Error exchanging code for token:', error)
//     res.status(500).json({ error: 'Failed to exchange code for token' })
//   }
// })

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at https://dev.vervesearch.com/_temp/tiktok-login/`)
})
