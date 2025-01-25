const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const app = express();
app.use(express.json());  // Make sure this is at the top

const PORT = 3000;
const client_id = 'e3f6705da6a7449c819fcfadd059a6d8';
const client_secret = '7eb256c0a33841aaac297416ce64d47c';

// Remove the login endpoint since we're handling that in the extension now

// Add the exchange endpoint
app.post('/exchange', async (req, res) => {
  const { code, redirect_uri } = req.body;
  console.log('Received exchange request:', { code, redirect_uri }); // Add logging
  
  try {
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      params: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('Token exchange successful'); // Add logging
    res.json(response.data);
  } catch (error) {
    console.error('Token exchange failed:', error);
    res.status(500).json({ error: 'Token exchange failed' });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});