import '../styles/tailwind.css';

import { setBackgroundImage } from '../components/bgImage';
import { updateClock } from '../components/clock';
import { login } from './auth';

// BACKGROUND IMAGE
setBackgroundImage();

// CLOCK FUNCTIONALITY
setInterval(updateClock, 1000);
updateClock();

// LOGIN FUNCTIONALITY
const loginButton = document.getElementById('loginButton');
if (loginButton) {
    // Add event listener to login button
    loginButton.addEventListener("click", async () => {
        console.log('Login button clicked');
        await login(); // Call the authentication function
    });
}
