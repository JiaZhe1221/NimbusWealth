document.addEventListener('DOMContentLoaded', () => {
    // Retrieve user data from local storage
    const userDataString = localStorage.getItem('userData');
  
    // Check if user data exists
    if (userDataString) {
      const userData = JSON.parse(userDataString);
  
      // Check if username exists
      if (userData.username) {
        // Update the content of the element with the username
        const usernamePlaceholder = document.getElementById('usernamePlaceholder');
        if (usernamePlaceholder) {
          usernamePlaceholder.textContent = userData.username;
        }
      }
    }
});