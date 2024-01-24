document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('.signin');
  const appleButton = document.querySelector('.fa-apple');


  if (loginForm && appleButton) {
    // Parse the query parameters from the URL
    const queryParams = new URLSearchParams(window.location.search);
    const username = queryParams.get('username');

    // Autofill the login form with the username
    if (username) {
      const usernameInput = loginForm.querySelector('input[name="username"]');
      if (usernameInput) {
        usernameInput.value = decodeURIComponent(username);
      }
    }

    const isAppleDevice = /iPhone|iPad|Mac/i.test(navigator.userAgent);

    // Hide the Apple button if the user is not on an Apple device
    if (!isAppleDevice) {
      appleButton.classList.add = 'hidden';

    }

    // Add event listener to the login form's submit button
    loginForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');
      const errorMessageElement = document.getElementById('error-message');
      
      // Check for null before accessing properties
      if (errorMessageElement) {
        errorMessageElement.classList.add('hidden');
        errorMessageElement.textContent = '';
      }

      try {
        const response = await fetch('http://localhost:8082/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: usernameInput ? usernameInput.value : null,
            password: passwordInput ? passwordInput.value : null,
          }),
        });

        if (response.ok) {
          const responseData = await response.json();

          if (responseData.success) {
            // Do something with the user data
            const userData = responseData.userData;
          
            // Store user data in sessionStorage or perform other actions
            sessionStorage.setItem('userData', JSON.stringify(userData));
          
            // Dispatch a custom event indicating successful login
            const loginEvent = new Event('loginSuccess');
            document.dispatchEvent(loginEvent);
          
            // Store a flag in local storage to indicate that the user is logged in
            localStorage.setItem('isLoggedIn', 'true');
          
            // Wait for a short duration before redirecting to allow the event and local storage update to be processed
            setTimeout(() => {
              window.location.href = 'about.html';
            }, 100); // Adjust the timeout duration as needed
          }

        } else {
          // Add red border to corresponding input fields
          if (response.status === 400 && usernameInput) {
            errorMessageElement.classList.remove('hidden');
            errorMessageElement.textContent = 'Username not found';
            usernameInput.classList.add('error-border');
            passwordInput.classList.remove('error-border');
          } else if (response.status === 401 && passwordInput) {
            errorMessageElement.classList.remove('hidden');
            errorMessageElement.textContent = 'Password incorrect';
            passwordInput.classList.add('error-border');
            usernameInput.classList.remove('error-border');
          } else {
            // Clear borders if the error is not related to username or password
            if (usernameInput) {
              usernameInput.classList.remove('error-border');
            }
            if (passwordInput) {
              passwordInput.classList.remove('error-border');
            }
          }
        }
      } catch (error) {
        console.error('Error during login:', error);

        // Handle other errors (e.g., network issues)
        // Optionally display an error message to the user
        if (errorMessageElement) {
          errorMessageElement.classList.remove('hidden');
          errorMessageElement.textContent = 'An error occurred. Please try again later.';
        }
      }
    });
  }
});
