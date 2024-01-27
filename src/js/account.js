// Get all card elements
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
const closeModalButton = document.getElementById('close'); // Replace with the correct ID
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
            console.log('Old password is correct');
            return true;
        } else {
            console.log('Incorrect old password');
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

        const result = await response.json();

        if (result.success) {
            console.log('Password updated on the server');
        } else {
            console.error('Failed to update password on the server');
        }
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
    console.log(userId)
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

// Function to get user information from local storage
function getUserInfo() {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
        return JSON.parse(userDataString);
    }
    return {};
}

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
function showModal() {
    document.getElementById('signOutModal').classList.remove('hidden');
}

// Function to hide the modal
function hideModal() {
    document.getElementById('signOutModal').classList.add('hidden');
}

// Event listener for the Sign Out button
document.getElementById('signOutButton').addEventListener('click', function () {
    // Show the modal
    showModal();
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

