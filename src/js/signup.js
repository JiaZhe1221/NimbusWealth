// Function to toggle password visibility
function togglePasswordVisibility(inputId, toggleIconId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(toggleIconId);

    const type = passwordInput.type === 'password' ? 'text' : 'password';

    passwordInput.type = type;

    // Change the lock icon based on the password visibility
    toggleIcon.className = type === 'password' ? 'fa-solid fa-lock hover:cursor-pointer' : 'fa-solid fa-unlock-alt hover:cursor-pointer';
}

// Add click event listeners for password fields
document.getElementById('togglePassword').addEventListener('click', function () {
    togglePasswordVisibility('password', 'togglePassword');
});

document.getElementById('toggleConfirmPassword').addEventListener('click', function () {
    togglePasswordVisibility('confirmPassword', 'toggleConfirmPassword');
});

document.querySelector('.signup').addEventListener('submit', async function (event) {
    const usernameInput = document.getElementsByName('username')[0];
    const emailInput = document.getElementsByName('emailaddress')[0];
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const errorContainer = document.getElementById('passwordMismatchError');
    const usernameErrorContainer = document.getElementById('usernameError');
    const emailErrorContainer = document.getElementById('emailError');


    try {
        // Check if passwords match
        if (passwordInput.value !== confirmPasswordInput.value) {
            event.preventDefault(); // Prevent form submission

            // Ensure that errorContainer is defined before manipulating it
            if (errorContainer) {
                errorContainer.classList.remove('hidden'); // Show the error message
                errorContainer.textContent = 'Passwords do not match';
            }

            // Add red border to password and confirm password inputs
            if (passwordInput) {
                passwordInput.classList.add('error-border');
            }
            if (confirmPasswordInput) {
                confirmPasswordInput.classList.add('error-border');
            }

            return;
        }

        // Clear any previous error messages related to password
        if (errorContainer) {
            errorContainer.classList.add('hidden'); // Hide the error message
            errorContainer.textContent = '';
        }

        const response = await fetch('https://jiazhe1221.github.io/NimbusWealth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: usernameInput.value,
                emailaddress: emailInput.value,
            }),
        });

        if (response.status === 400) {
            // Username or email already taken
            event.preventDefault(); // Prevent form submission
          
            const errorMessage = await response.text();
          
            // Ensure that both usernameErrorContainer and emailErrorContainer are defined before manipulating them
            if (errorMessage.includes('Username') && usernameErrorContainer) {
              usernameErrorContainer.classList.remove('hidden'); // Show the username error message
              usernameErrorContainer.textContent = 'Username is already taken. Please choose a different username.';
            } else if (usernameErrorContainer) {
              usernameErrorContainer.classList.add('hidden'); // Hide the username error message
              usernameErrorContainer.textContent = '';
            }
          
            if (errorContainer) {
              errorContainer.classList.add('hidden'); // Hide the common error message
              errorContainer.textContent = '';
            }
          
            if (errorMessage.includes('Email') && emailErrorContainer) {
              emailErrorContainer.classList.remove('hidden'); // Show the email error message
              emailErrorContainer.textContent = 'Email is already registered. Please use a different email address.';
            } else if (emailErrorContainer) {
              emailErrorContainer.classList.add('hidden'); // Hide the email error message
              emailErrorContainer.textContent = '';
            }
          
            // Add or remove red border from corresponding input fields based on existence of errors
            if (errorMessage.includes('Username') && usernameInput) {
              usernameInput.classList.add('error-border');
            } else if (usernameInput) {
              usernameInput.classList.remove('error-border');
            }
          
            if (errorMessage.includes('Email') && emailInput) {
              emailInput.classList.add('error-border');
            } else if (emailInput) {
              emailInput.classList.remove('error-border');
            }
          
            return;
          }
        // Clear any previous error messages related to username
        if (usernameErrorContainer) {
            usernameErrorContainer.classList.add('hidden'); // Hide the error message
            usernameErrorContainer.textContent = '';
        }

        // If you reach this point, both password and username are good
        // You can redirect the user to the login page with autofilled data

        const userData = {
            username: usernameInput.value,
        };

        // Encode user data for URL
        const encodedUserData = Object.keys(userData)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(userData[key]))
            .join('&');

        // Redirect to login page with autofilled data
        window.location.href = `login.html?${encodedUserData}`;

    } catch (error) {
        console.error('Error checking username or passwords:', error);
        // Handle error (e.g., show a generic error message to the user)
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('.signup');
  
    if (signupForm) {
      signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(signupForm);
        const userData = {};
        formData.forEach((value, key) => {
          userData[key] = value;
        });
  
        try {
          const response = await fetch('http://localhost:8082/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });
  
          if (response.ok) {
            // Store user data in sessionStorage
            sessionStorage.setItem('userData', JSON.stringify(userData));
  
            // Redirect to login page upon successful registration
            window.location.href = 'login.html';
          } else {
            // Handle different HTTP status codes
            const errorMessage = await response.text();
            console.error('Registration failed:', errorMessage);
            // Optionally display an error message to the user
          }
        } catch (error) {
          console.error('Error during registration:', error);
          // Handle other errors (e.g., network issues)
          // Optionally display an error message to the user
        }
      });
    } else {
      console.error('Signup form not found.');
    }
  });