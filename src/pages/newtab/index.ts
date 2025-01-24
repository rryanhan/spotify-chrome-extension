import './styles/tailwind.css';

console.log("hello world!");

const loginButton = document.getElementById('loginButton');
if (loginButton) {
  loginButton.addEventListener("click", () => {
    console.log('button clicked');
    chrome.tabs.create({ url: "http://localhost:3000/login" });
  });
} 