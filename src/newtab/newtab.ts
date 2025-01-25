import '../styles/tailwind.css';


// Set default background image if not already set
const defaultBackgroundImage = 'images/def-backdrop.jpg'; 
console.log('Using background image:', defaultBackgroundImage);

const preloadImage = (src: string) => {
    const img = new Image();
    img.src = src;
};
preloadImage(defaultBackgroundImage);

chrome.storage.local.get(['backgroundImage'], (result) => {
  if (!result.backgroundImage) {
    chrome.storage.local.set({ backgroundImage: defaultBackgroundImage });
  }
});
// Get the background image from storage
chrome.storage.local.get(['backgroundImage'], (result) => {
    const backgroundImage = result.backgroundImage || defaultBackgroundImage;
    document.body.style.backgroundImage = `url(${backgroundImage})`;
    document.body.style.backgroundSize = 'cover'; 
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'center'; 
    document.body.style.height = '100vh';
  });


// LOGIN FUNCTIONALITY
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
        // Method is POST because data is being sent to the server
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code, // Auth code received from Spotify
          redirect_uri: redirectUrl // Redirect URL of the extension
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