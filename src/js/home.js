// On page load or when changing themes, best to add inline in `head` to avoid FOUC
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark')
}

document.getElementById('getStartedBtn').addEventListener('click', function() {
  window.location.href = 'src/pages/signup.html'; // Replace 'login.html' with the actual path to your login page
});

document.getElementById('getStartedBtnhome').addEventListener('click', function() {
    window.location.href = 'src/pages/signup.html'; // Replace 'login.html' with the actual path to your login page
  });