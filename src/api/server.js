const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const app = express();
const PORT = 3000

const client_id = 'e3f6705da6a7449c819fcfadd059a6d8'
const redirect_uri = 'http://localhost:3000/callback'

app.get('/login', (req, res) => {
    const scope = 'user-read-private user-read-email'


    res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,

    }));
})



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});