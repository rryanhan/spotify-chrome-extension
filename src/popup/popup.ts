const loginButton = document.getElementById('loginButton')

if (loginButton) {
  loginButton.addEventListener("click", () => {
    console.log('button clicked')
    window.location.href = "http://localhost:3000/login"
});
}