import '../styles/tailwind.css';

const loginButton = document.getElementById('loginButton');
if (loginButton) {
    // Add event listener to login button
  loginButton.addEventListener("click", async () => {
    console.log('Login button clicked');
    
    try {
        // Get extension's unique redirect URL
      const redirectUrl = chrome.identity.getRedirectURL();
      console.log('Redirect URL:', redirectUrl);

      // Build Spotify authorization URL with required parameters
      const authUrl = 'https://accounts.spotify.com/authorize?' +
        new URLSearchParams({
          response_type: 'code',
          client_id: 'e3f6705da6a7449c819fcfadd059a6d8',
          scope: 'user-read-private user-read-email',
          redirect_uri: redirectUrl
        }).toString();
      
      console.log('Auth URL:', authUrl);

      // Open Spotify login popup with auth URL, wait for response
      // launchWebAuthFlow will open Spotify login popup, intercepts the response and returns the URL
      const responseUrl = await chrome.identity.launchWebAuthFlow({
        url: authUrl,
        interactive: true
      });

      // Check if response URL is receieved
      if (!responseUrl) {
        throw new Error('No response URL received');
      }

      // Extract auth code from Spotify response URL
      const url = new URL(responseUrl);
      const code = url.searchParams.get('code');
      
      // Ensure auth code is received
      if (!code) {
        throw new Error('No auth code received');
      }

      console.log('Got auth code:', code);

      // Call server at exchange endpoint to exchange auth code for tokens
      const response = await fetch('http://localhost:3000/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code,
          redirect_uri: redirectUrl
        })
      });

      // Check if response is successful
      if (!response.ok) {
        throw new Error(`Exchange failed: ${response.status}`);
      }

      // Get token data from exchange endpoint
      const tokens = await response.json(); // Contains token data
      console.log('Got tokens:', tokens);

      // Store tokens in extension storage, Promise needed to wait for storage to be set
      await new Promise<void>((resolve) => {
        chrome.storage.local.set({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token
        }, resolve);
      });

      console.log('Tokens stored successfully');
    } catch (error) {
      console.error('Auth failed:', error);
    }
  });
} 