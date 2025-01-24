import '../styles/tailwind.css';

const loginButton = document.getElementById('loginButton');
if (loginButton) {
  loginButton.addEventListener("click", () => {
    console.log('button clicked');
    chrome.tabs.create({ url: "http://localhost:3000/login" });
  });
} 