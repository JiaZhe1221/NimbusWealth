// Mock user data for demonstration purposes
const users = [
    { email: 'user@example.com', password: 'password' },
    // Add more users as needed
];

function toggleSections() {
    document.getElementById('signupSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('errorMessage').innerHTML = '';
}

function signup() {
    // Mock signup logic
    const signupEmail = document.getElementById('signupEmail').value;
    const signupPassword = document.getElementById('signupPassword').value;

    // Check if the email is not already registered
    if (users.some(user => user.email === signupEmail)) {
        document.getElementById('errorMessage').innerHTML = 'Email is already registered.';
    } else {
        // For demonstration, add the user to the list
        users.push({ email: signupEmail, password: signupPassword });

        // Automatically switch to the login section
        toggleSections();
    }
}

function login() {
    // Mock login logic
    const loginEmail = document.getElementById('loginEmail').value;
    const loginPassword = document.getElementById('loginPassword').value;

    // Check if the email and password match any user
    const user = users.find(u => u.email === loginEmail && u.password === loginPassword);

    if (user) {
        // For demonstration, you might redirect to the main page
        console.log('Login successful');
    } else {
        document.getElementById('errorMessage').innerHTML = 'Invalid email or password.';
    }
}

function googleSignIn() {
    // Mock Google Sign-In logic
    console.log('Signing in with Google');
}

function appleSignIn() {
    // Mock Apple Sign-In logic
    console.log('Continuing with Apple');
}
