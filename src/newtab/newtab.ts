import '../styles/tailwind.css';

const loginButton = document.getElementById('loginButton');
if (loginButton) {
  loginButton.addEventListener("click", async () => {
    console.log('Login button clicked');
    
    try {
      const redirectUrl = chrome.identity.getRedirectURL();
      console.log('Redirect URL:', redirectUrl);
      
      const authUrl = 'https://accounts.spotify.com/authorize?' +
        new URLSearchParams({
          response_type: 'code',
          client_id: 'e3f6705da6a7449c819fcfadd059a6d8',
          scope: 'user-read-private user-read-email',
          redirect_uri: redirectUrl
        }).toString();
      
      console.log('Auth URL:', authUrl);

      const responseUrl = await chrome.identity.launchWebAuthFlow({
        url: authUrl,
        interactive: true
      });

      if (!responseUrl) {
        throw new Error('No response URL received');
      }

      const url = new URL(responseUrl);
      const code = url.searchParams.get('code');
      
      if (!code) {
        throw new Error('No auth code received');
      }

      console.log('Got auth code:', code);

      const response = await fetch('http://localhost:3000/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code,
          redirect_uri: redirectUrl
        })
      });

      if (!response.ok) {
        throw new Error(`Exchange failed: ${response.status}`);
      }

      const tokens = await response.json();
      console.log('Got tokens:', tokens);

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