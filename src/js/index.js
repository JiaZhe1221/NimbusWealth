// On page load or when changing themes, best to add inline in `head` to avoid FOUC
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark')
}

const getstartedhome = document.getElementById('getStartedBtnhome')

if (getstartedhome) {
  getstartedhome.addEventListener('click', function() {
    window.location.href = 'src/pages/login.html'; 
  });
}

const mobileGetStartedBtn = document.getElementById('mobileGetStartedBtn');

if (mobileGetStartedBtn) {
  mobileGetStartedBtn.addEventListener('click', function() {
    window.location.href = 'src/pages/login.html'; 
  });
}

const getstartedbtn = document.getElementById('getStartedBtnhomeoverview')

if (getstartedbtn) {
  getstartedbtn.addEventListener('click', function() {
    window.location.href = 'src/pages/login.html';
});
}

const profileicon = document.getElementById('profile-icon-container')

if (profileicon) {
  profileicon.addEventListener('click', function() {
    window.location.href = 'src/pages/account.html';
  })
}

const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';


function clickDownButton() {
  const downButton = document.getElementById('downButton');
  if (downButton) {
    const clickEvent = new Event('click');
    downButton.dispatchEvent(clickEvent);
  }
}

if (isLoggedIn) {
  setTimeout(clickDownButton, 100);
  const getStartedButton = document.getElementById('getStartedBtnhome');
  const profileIconContainer = document.getElementById('profile-icon-container');
  const getStartedButtonoverview = document.getElementById('getStartedBtnhomeoverview');
  const accountSidebar = document.getElementById('account-sidebar');
  const mobileDownload = document.getElementById('mobileDownload');


  if (getStartedButton) {
    getStartedButton.style.display = 'none';
    getStartedButtonoverview.classList.add('md:hidden')
  }
  if (profileIconContainer) {
    profileIconContainer.style.display = 'block';
  }
  if (accountSidebar) {
    accountSidebar.classList.remove('hidden');
  }
  if (mobileGetStartedBtn) {
    mobileGetStartedBtn.classList.add('hidden');
  }
  if (mobileDownload) {
    mobileDownload.classList.remove('hidden');
  }
}

document.addEventListener("DOMContentLoaded", function () {
  AOS.init();
});

document.addEventListener('DOMContentLoaded', function () {
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const sidebar = document.getElementById('sidebar');
  const body = document.body;
  const mobilegetStarted = document.getElementById('mobileDownload');
  const downloadApp = document.getElementById('downloadAPP');

  if (mobileNavToggle && sidebar) {
      mobileNavToggle.addEventListener('click', () => {
          sidebar.classList.remove('hidden');
          setTimeout(() => {
            sidebar.classList.toggle('translate-x-0');
            body.classList.toggle('overflow-hidden'); 
            
          }, 100);
          
      });

      // Close sidebar when clicking outside
      document.addEventListener('click', (event) => {
          const isClickInside = sidebar.contains(event.target) || mobileNavToggle.contains(event.target);

          if (!isClickInside && sidebar.classList.contains('translate-x-0')) {
              sidebar.classList.remove('translate-x-0');
              body.classList.remove('overflow-hidden'); // Remove class to allow scrolling
          }
      });

      // Close sidebar when a link or the Get Started button is clicked
      sidebar.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', () => {
              sidebar.classList.remove('translate-x-0');
              body.classList.remove('overflow-hidden'); // Remove class to allow scrolling
          });
      });

      if (mobilegetStarted) {
        mobilegetStarted.addEventListener('click', function() {
          // Detect the device type
          var userAgent = navigator.userAgent || navigator.vendor || window.opera;

          if (/android/i.test(userAgent)) {
            // Redirect to Android app store
            window.location.href = 'https://play.google.com/store/apps/details?id=your-android-app-package';
          } else if (/iPad|iPhone|iPod/i.test(userAgent)) {
            // Redirect to iOS app store
            window.location.href = 'https://apps.apple.com/app/your-ios-app-id';
          } else {
            // Fallback link for other devices
            window.location.href = 'fallback-link.html';
          }
        });
      }

      if (downloadApp) {
        downloadApp.addEventListener('click', function() {
          // Detect the device type
          var userAgent = navigator.userAgent || navigator.vendor || window.opera;

          if (/android/i.test(userAgent)) {
            // Redirect to Android app store
            window.location.href = 'https://play.google.com/store/apps/details?id=your-android-app-package';
          } else if (/iPad|iPhone|iPod/i.test(userAgent)) {
            // Redirect to iOS app store
            window.location.href = 'https://apps.apple.com/app/your-ios-app-id';
          } else {
            // Fallback link for other devices
            window.location.href = 'fallback-link.html';
          }
        });
      }
  } else {
      console.error('Mobile nav toggle button or sidebar not found.');
  }
});

