// On page load or when changing themes, best to add inline in `head` to avoid FOUC
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark')
}

document.getElementById('getStartedBtnhome').addEventListener('click', function() {
  window.location.href = 'src/pages/signup.html'; 
});

document.getElementById('getStartedBtnhomeoverview').addEventListener('click', function() {
    window.location.href = 'src/pages/signup.html';
  });

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (isLoggedIn) {
    const getStartedButton = document.getElementById('getStartedBtnhome');
    const profileIconContainer = document.getElementById('profile-icon-container');
    const getStartedButtonoverview = document.getElementById('getStartedBtnhomeoverview');

    if (getStartedButton) {
      getStartedButton.style.display = 'none';
      getStartedButtonoverview.classList.add('hidden')
    }
    if (profileIconContainer) {
      profileIconContainer.style.display = 'block';
    }
  }else {
  }
  