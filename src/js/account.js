async function fetchAndUpdateLocalStorage() {
    try {
      const userInfo = getUserInfo();
      console.log(userInfo)
      const userId = userInfo && userInfo._id.toString();
      if (!userId) {
        console.error('User ID not found in userInfo.');
        return;
      }
  
      const response = await fetch(`http://localhost:8082/getUserData?userId=${userId}`);
      const userData = await response.json();
      if (userData && userData.userData) {
        // Remove the specific property
        delete userData.userData;
      
        // Store the modified user data back in local storage
        localStorage.setItem('userData', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error fetching and updating local storage:', error);
    }
}
  

// Function to get user information from local storage
function getUserInfo() {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
        return JSON.parse(userDataString);
    }
    return {};
}

// Function to update wallet items using data from local storage
function updateWalletItems() {
    try {
      // Retrieve user data from local storage
      const userData = getUserInfo();
      if (userData) {
        const walletItems = userData.walletItems || [];
  
        // Clear existing content in the wallet container
        const walletContainer = document.getElementById('wallet');
        walletContainer.innerHTML = '';
  
        // Group wallet items by type
        const walletItemsByType = {};
        walletItems.forEach((item) => {
          if (!walletItemsByType[item.type]) {
            walletItemsByType[item.type] = [];
          }
          walletItemsByType[item.type].push(item);
        });
  
        // Iterate over wallet items by type and add them to the wallet container
        for (const [type, items] of Object.entries(walletItemsByType)) {
          const typeContainer = document.createElement('div');
          typeContainer.className = 'bg-white dark:bg-gray-800 p-4 rounded-md shadow-md h-max relative mb-6';
  
          // Add type heading
          const typeHeading = document.createElement('div');
          typeHeading.className = 'flex justify-between mb-6';
          typeHeading.innerHTML = `
            <div>
              <p class="text-xl font-semibold text-gray-900 dark:text-white p-1">${type}</p>
            </div>
          `;
          typeContainer.appendChild(typeHeading);
  
          // Add wallet items for the current type
          const typeContent = document.createElement('div');
          typeContent.id = `collapsibleContent${type}`;
          typeContent.className = 'ml-2 mt-4';
  
          items.forEach((item) => {
            const walletItemDiv = document.createElement('div');
            walletItemDiv.className = 'flex items-center mb-4';
            walletItemDiv.innerHTML = `
              <i class="fa fa-wallet text-xl text-gray-900 dark:text-white"></i>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-2">${item.name}</p>
              <p class="ml-auto text-sm text-gray-600 dark:text-gray-400 mt-1">$${item.amount}</p>
            `;
            typeContent.appendChild(walletItemDiv);
          });
  
          typeContainer.appendChild(typeContent);
          walletContainer.appendChild(typeContainer);
        }
      } else {
        console.error('User data not found in local storage.');
      }
    } catch (error) {
      console.error('Error updating wallet items:', error);
    }
}
  
// Function to handle the page load event
window.addEventListener('load', async () => {
    // Call the function to fetch and update local storage
    await fetchAndUpdateLocalStorage();
});




const cards = document.querySelectorAll('.relative[data-section]');

cards.forEach(card => {
    card.addEventListener('click', function () {
        const sectionName = this.dataset.section;
        // Show modal
        document.getElementById('authentication-modal').classList.remove('hidden');

        updateModalContent(sectionName);

    });
});

function updateModalContent(sectionName) {
    // Hide all sections
    const modalSections = document.querySelectorAll('#change-info-section > div');
    modalSections.forEach(section => {
        section.classList.add('hidden');

        const inputElement = section.querySelector('input');
        if (inputElement) {
            inputElement.removeAttribute('required');
        }
    });

    // Show the specific section
    const specificSection = Array.from(modalSections).find(section => section.id === sectionName);
    specificSection.classList.remove('hidden');
    const inputElement = specificSection.querySelector('input')
    if (inputElement) {
        inputElement.setAttribute('required', 'required');
    }
    const button = document.getElementById('update');
    button.classList.remove('hidden')


}

// Attach hideModal function to close button
const closeModalButton = document.getElementById('close'); 
closeModalButton.addEventListener('click', function() {
    document.getElementById('authentication-modal').classList.add('hidden');

});

// Function to update data in local storage
function updateLocalStorage(key, value) {
    // Retrieve existing data from local storage
    const storedData = JSON.parse(localStorage.getItem('userData')) || {};

    // Update the specific key with the new value
    storedData[key] = value;

    // Save the updated data back to local storage
    localStorage.setItem('userData', JSON.stringify(storedData));
}

// Function to hide and show password
function setupPasswordToggle(inputId, toggleId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(toggleId);

    if (toggleIcon) {
        toggleIcon.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
    
            // Toggle eye icon
            toggleIcon.innerHTML = type === 'password' ? '<i class="fa fa-eye" aria-hidden="true"></i>' : '<i class="fa fa-eye-slash" aria-hidden="true"></i>';
        });

    }
    
}

// Handle each hide/show button
setupPasswordToggle('oldpassword', 'toggleOldPassword');
setupPasswordToggle('newpassword', 'toogleNewPassword');
setupPasswordToggle('conpassword', 'toggleConPassword');


// Check if username already exist
async function isUsernameUnique(newUsername) {
    try {
        const response = await fetch('http://localhost:8082/checkUsername', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newUsername: newUsername }),
        });

        const result = await response.json();

        return result.success;
    } catch (error) {
        console.error('Error checking username uniqueness:', error);
        return false;
    }
}

// Function to update username
async function updateUsernameOnServer(userId, newUsername) {
    try {
        const response = await fetch('http://localhost:8082/updateUsername', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId, newUsername: newUsername }),
        });

        const result = await response.json();

        if (result.success) {
            // Update successful
            updateLocalStorage('username', newUsername);
        } else {
            // Display error message from the server
            displayErrorMessage(result.message);
        }
    } catch (error) {
        console.error('Error updating username on the server:', error);
        displayErrorMessage('An error occurred. Please try again.');
    }
}


// Function to check if the entered old password matches the stored password
async function checkOldPassword(userId, enteredPassword) {
    try {
        const response = await fetch('http://localhost:8082/checkOldPassword', {
            
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                oldPassword: enteredPassword,
            }),
        });

        const result = await response.json();

        if (result.success) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking old password:', error);
        return false;
    }
}



// Function to update new password
async function updatePasswordOnServer(userId, newPassword) {
    try {
        const requestBody = {
            _id: userId,
            newPassword: newPassword,
        };

        const response = await fetch('http://localhost:8082/updatePassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        await response.json();
    } catch (error) {
        console.error('Error updating password on the server:', error);
    }
}

// Function to check if email is unique
async function isEmailUnique(email) {
    try {
        const response = await fetch('http://localhost:8082/checkEmailExistence', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }),
        });

        const result = await response.json();

        if (result.success) {
            // Email is unique
            return true;
        } else {
            // Email already exists
            return false;
        }
    } catch (error) {
        console.error('Error checking email existence:', error);
        return false;
    }
}

// Function to update email
async function updateEmailOnServer(userId, newEmail) {
    try {
        // Check if the new email already exists
        const isUnique = await isEmailUnique(newEmail);

        if (isUnique) {
            // Make a request to update the email on the server
            const response = await fetch('http://localhost:8082/updateEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userId, newEmail: newEmail }),
            });

            const result = await response.json();

            if (result.success) {
                // Update successful
                updateLocalStorage('email', newEmail);
            } else {
                // Display error message from the server
                displayErrorMessage(result.message);
            }
        } else {
            displayErrorMessage('Email already exists. Please choose a different email.');
        }
    } catch (error) {
        console.error('Error updating email on the server:', error);
        displayErrorMessage('An error occurred. Please try again.');
    }
}

// Function to update Birthdate
async function updateBirthdateOnServer(userId, newBirthdate) {
    try {
        const response = await fetch('http://localhost:8082/updateBirthdate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId, newBirthdate: newBirthdate }),
        });

        const result = await response.json();

        if (result.success) {
            // Update successful
            updateLocalStorage('birthdate', newBirthdate);
        } else {
            // Display error message from the server
            displayErrorMessage(result.message);
        }
    } catch (error) {
        console.error('Error updating birthdate on the server:', error);
        displayErrorMessage('An error occurred. Please try again.');
    }
}

// Function to update currency
async function updateCurrencyOnServer(userId, newCurrency) {
    try {
        const response = await fetch('http://localhost:8082/updateCurrency', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId, newCurrency: newCurrency }),
        });

        const result = await response.json();

        if (result.success) {
            // Update successful
            updateLocalStorage('currency', newCurrency);
        } else {
            // Display error message from the server
            displayErrorMessage(result.message);
        }
    } catch (error) {
        console.error('Error updating currency on the server:', error);
        displayErrorMessage('An error occurred. Please try again.');
    }
}

// Function to show error message
function displayErrorMessage(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

// Function to handle form submission
async function handleFormSubmission(event) {
    event.preventDefault();

    const userInfo = getUserInfo();
    const userId = userInfo._id;
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const oldPassword = formData.get('oldpassword');
    const newPassword = formData.get('newpassword');
    const confirmPassword = formData.get('conpassword');
    const email = formData.get('email');
    const birthdate = formData.get('birthdate');
    const currency = formData.get('currency');

    if (username) {
        // Check if the new username already exists
        const isUnique = await isUsernameUnique(username);

        if (isUnique) {
            // Make a request to update the username on the server
            await updateUsernameOnServer(userId, username);
        } else {
            displayErrorMessage('Username already exists. Please choose a different username.');
            return;
        }
    }

    if (oldPassword) {
        try {
            const isOldPasswordCorrect = await checkOldPassword(userId, oldPassword);

            if (isOldPasswordCorrect) {
                if (newPassword && confirmPassword && newPassword === confirmPassword) {
                    // Make a request to update the password on the server
                    await updatePasswordOnServer(userId, newPassword);
                } else {
                    displayErrorMessage('Passwords do not match. Please try again.');
                    return;
                }
            } else {
                displayErrorMessage('Incorrect old password. Please try again.');
                return;
            }
        } catch (error) {
            console.error('Error checking old password:', error);
            displayErrorMessage('An error occurred. Please try again.');
            return;
        }
    }

    if (email) {
        // Check if the new email already exists
        const isUnique = await isEmailUnique(email);

        if (isUnique) {
            // Make a request to update the email on the server
            await updateEmailOnServer(userId, email);
        } else {
            displayErrorMessage('Email already exists. Please choose a different email.');
            return;
        }
    }

    if (birthdate) {
        await updateBirthdateOnServer(userId, birthdate);
    }

    if (currency) {
        await updateCurrencyOnServer(userId, currency);

    }

    document.getElementById('authentication-modal').classList.add('hidden');
    location.reload();
}



// Attach the handleFormSubmission function to the form's submit event
const form = document.querySelector('#change-info-section');
form.addEventListener('submit', handleFormSubmission);

// Function to update account information
function updateAccountInformation() {
    const userInfo = getUserInfo();

    // Update the DOM elements
    document.getElementById('usernameValue').textContent = userInfo.username || 'No username available';
    document.getElementById('emailValue').textContent = userInfo.email || 'No email available';
    document.getElementById('passwordValue').textContent = userInfo.password ? '********' : 'No password available';
    document.getElementById('currencyValue').textContent = userInfo.currency || 'No currency available';
    document.getElementById('birthdateValue').textContent = userInfo.birthdate || 'No birthdate available';
}


// Call the function to update account information on page load
updateAccountInformation();




// Function to update the welcome message and user email
function updateWelcomeMessage() {
    const { username, email } = getUserInfo();

    // Update the DOM elements
    document.getElementById('welcomeMessage').textContent = `Welcome, ${username || 'Guest'}`;
    document.getElementById('userEmail').textContent = email || 'No email available';
}


// Function to update account information
function updateAccountInformation() {
    const { username, email, password, currency, birthdate } = getUserInfo();

    // Update the DOM elements
    document.getElementById('usernameValue').textContent = username || 'No username available';
    document.getElementById('emailValue').textContent = email || 'No email available';
    document.getElementById('passwordValue').textContent = password ? '********' : 'No password available';
    document.getElementById('currencyValue').textContent = currency || 'No currency available';
    document.getElementById('birthdateValue').textContent = birthdate || 'No birthdate available';
}

// Call the function to update account information on page load
updateAccountInformation();

// Function to handle button click and update content and button styles
function handleButtonClick(button, contentToShow, otherContents, otherBtn, storageKey) {
    button.addEventListener('click', function () {
        // Change the content
        contentToShow.classList.remove('hidden');
        otherContents.forEach(content => content.classList.add('hidden'));

        // Change the color of the buttons
        button.classList.remove('text-gray-900', 'dark:text-gray-400');
        button.classList.add('text-blue-700', 'dark:text-blue-500');

        otherBtn.forEach(otherButton => {
            otherButton.classList.remove('text-blue-700', 'dark:text-blue-500');
            otherButton.classList.add('text-gray-900', 'dark:text-gray-400');
        });

        // Set active section in session storage
        sessionStorage.setItem(storageKey, button.id);
    });
}

// Function to check and set the active section based on session storage
function setActiveSectionFromStorage() {
    const activeSectionId = sessionStorage.getItem('activeSection');
    if (activeSectionId) {
        const activeSection = document.getElementById(activeSectionId);
        if (activeSection) {
            activeSection.click();
        }
    }
}

// Function to handle collapsible content toggle and save state to local storage
function handleCollapsibleContentToggle(collapseBtn, collapsibleContent, storageKey) {
    const isCollapsed = sessionStorage.getItem(storageKey) === 'true';

    // Set initial state
    if (isCollapsed) {
        collapsibleContent.classList.add('hidden');
    }

    collapseBtn.addEventListener('click', () => {
        collapsibleContent.classList.toggle('hidden');

        // Update local storage state
        sessionStorage.setItem(storageKey, collapsibleContent.classList.contains('hidden').toString());
    });
}

// Account Information
const accountbtn = document.getElementById('account-info-btn');
const accountInformation = document.querySelector("#account-information");

// Wallet
const walletbtn = document.getElementById('wallet-btn');
const wallet = document.querySelector("#wallet");

// FIP
const fipbtn = document.getElementById('fip-btn');
const fip = document.querySelector("#fip");

// Set up button click handlers and collapsible content toggles
if (walletbtn && accountbtn && fipbtn) {
    handleButtonClick(walletbtn, wallet, [accountInformation, fip], [accountbtn, fipbtn], 'activeSection');
    handleButtonClick(accountbtn, accountInformation, [wallet, fip], [walletbtn, fipbtn], 'activeSection');
    handleButtonClick(fipbtn, fip, [accountInformation, wallet], [accountbtn, walletbtn], 'activeSection');
}

// Set up collapsible content toggles
handleCollapsibleContentToggle(document.getElementById('collapseBtnCash'), document.getElementById('collapsibleContentCash'), 'collapseCash');
handleCollapsibleContentToggle(document.getElementById('collapseBtnCards'), document.getElementById('collapsibleContentCards'), 'collapseCards');
handleCollapsibleContentToggle(document.getElementById('collapseBtnOnline'), document.getElementById('collapsibleContentOnline'), 'collapseOnline');
handleCollapsibleContentToggle(document.getElementById('collapseBtnStocks'), document.getElementById('collapsibleContentStocks'), 'collapseStocks');
handleCollapsibleContentToggle(document.getElementById('collapseBtnRecharge'), document.getElementById('collapsibleContentRecharge'), 'collapseRecharge');
handleCollapsibleContentToggle(document.getElementById('collapseBtnLoan'), document.getElementById('collapsibleContentLoan'), 'collapseLoan');


setActiveSectionFromStorage();
updateWelcomeMessage();


// Function to handle signout 
function showsoModal() {
    document.getElementById('signOutModal').classList.remove('hidden');
}

// Function to hide the modal
function hideModal() {
    document.getElementById('signOutModal').classList.add('hidden');
}

// Event listener for the Sign Out button
document.getElementById('signOutButton').addEventListener('click', function () {
    // Show the modal
    showsoModal();
});

// Event listener for the Confirm Sign Out button in the modal
document.getElementById('confirmSignOut').addEventListener('click', function () {
    // Clear local storage and session storage
    localStorage.clear();
    sessionStorage.clear();


    // Redirect to the home page
    window.location.href = 'home.html';
});

// Event listener for the Cancel button in the modal
document.getElementById('cancelSignOut').addEventListener('click', function () {
    // Hide the modal
    hideModal();
});

// Handle add account
const closeAccModalButton = document.getElementById('closeAccModalButton');
const addItemButton = document.getElementById('walletmodal');
const toggleAddButton = document.getElementById('addButton')

// Function to show pop up window
function showModal() {
    const addWindow = document.getElementById('addWalletItemModal')
    addWindow.classList.remove('hidden')
}

// Function to close the modal
function closeModal() {
    const addWindow = document.getElementById('addWalletItemModal')
    addWindow.classList.add('hidden')
}

// Function to handle the submit (placeholder for now)
async function submitForm(event) {
    event.preventDefault(); 

    const userInfo = getUserInfo();
    const userId = userInfo._id;
    const name = document.getElementById('name').value;
    const type = document.getElementById('walletItemType').value;
    const currency = document.getElementById('currencywallet').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const errorMessageWallet = document.getElementById('errorMessageWallet');


    // Make a POST request to the server
    const response = await fetch('http://localhost:8082/addWalletItem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, name, type, currency, amount })
    });

    const result = await response.json();

    // Check for error in the response
    if (!response.ok) {
        const resultError = result.error || 'An error occurred.';
        console.error(resultError);

        // Display an error message to the user
        if (resultError.includes('Wallet item with this name already exists for the user.')) {
            // Show the error message
            errorMessageWallet.classList.add('hidden');
            errorMessageWallet.classList.remove('hidden');
        } else {
            // Hide the error message if there's a different error
            errorMessageWallet.classList.add('hidden');
        }

        return; // Exit the function to prevent further execution
    }
}


if (closeModalButton) {
    closeAccModalButton.addEventListener("click", closeModal);
}

if(addItemButton) {
    addItemButton.addEventListener('submit', submitForm);
}

if(toggleAddButton) {
    toggleAddButton.addEventListener("click", showModal);
}
