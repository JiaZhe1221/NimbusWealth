async function fetchAndUpdateLocalStorage() {
    try {
      console.log('Before getUserInfo');
      const userInfo = await getUserInfo();
      console.log('After getUserInfo', userInfo);
  
      const userId = userInfo && userInfo._id.toString();
  
      if (!userId) {
        console.error('User ID not found in userInfo.');
        return;
      }
  
      const response = await fetch(`http://localhost:8082/getUserData?userId=${userId}`);
      const userData = await response.json();
      console.log('Fetched userData', userData);
  
      if (userData && userData.user) {
        // Remove the specific property
        delete localStorage.userData;
        // Store the user data in local storage
        localStorage.setItem('userData', JSON.stringify(userData.user));
        console.log('LocalStorage updated with userData');
      } else {
        console.error('No userData.userData found in the response:', userData);
      }
    } catch (error) {
      console.error('Error fetching and updating local storage:', error);
    }
  }
  

async function fetchLocalStorage() {
    await fetchAndUpdateLocalStorage();
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
}
  


fetchLocalStorage();
