// On page load or when changing themes, best to add inline in `head` to avoid FOUC
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

// JavaScript to handle button click event and navigate to login page
document.getElementById('getStartedBtn').addEventListener('click', function() {
  window.location.href = 'signup.html'; // Replace 'login.html' with the actual path to your login page
});

// Function for goback button
function goBack() {
  window.history.back();
}

// Check if the user is logged in
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

if (isLoggedIn) {
  // Perform actions as needed for a logged-in user
  console.log('User is logged in.');
  const getStartedButton = document.getElementById('getStartedBtn');
  const profileIconContainer = document.getElementById('profile-icon-container');
  if (getStartedButton) {
    getStartedButton.style.display = 'none';
  }
  if (profileIconContainer) {
    profileIconContainer.style.display = 'block';
  }
}
