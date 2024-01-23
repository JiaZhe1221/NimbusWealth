document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.signin');
  
    if (loginForm) {
        console.log("loaded")
      // Parse the query parameters from the URL
      const queryParams = new URLSearchParams(window.location.search);
      const username = queryParams.get('username');
  

      // Autofill the login form with the username
      if (username) {
        const usernameInput = loginForm.querySelector('input[name="username"]'); // Use the correct input name
        if (usernameInput) {
          usernameInput.value = decodeURIComponent(username);
        }
      }
    }
  });
  