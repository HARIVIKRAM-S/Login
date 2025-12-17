// Login Form Submission Handler
// Created: 2025-12-17 04:50:22 UTC

document.addEventListener('DOMContentLoaded', function() {
  // Get the login form element
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmission);
  }
});

/**
 * Handles login form submission
 * @param {Event} event - The form submission event
 */
function handleLoginSubmission(event) {
  event.preventDefault();
  
  // Get form input values
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  
  // Validate inputs
  if (!validateInputs(email, password)) {
    return;
  }
  
  // Show loading state
  showLoadingState(true);
  
  // Submit login credentials
  submitLogin(email, password);
}

/**
 * Validates email and password inputs
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {boolean} - True if valid, false otherwise
 */
function validateInputs(email, password) {
  const errorContainer = document.getElementById('errorMessage');
  
  // Clear previous errors
  if (errorContainer) {
    errorContainer.textContent = '';
    errorContainer.style.display = 'none';
  }
  
  // Validate email
  if (!email) {
    showError('Email is required');
    return false;
  }
  
  if (!isValidEmail(email)) {
    showError('Please enter a valid email address');
    return false;
  }
  
  // Validate password
  if (!password) {
    showError('Password is required');
    return false;
  }
  
  if (password.length < 6) {
    showError('Password must be at least 6 characters long');
    return false;
  }
  
  return true;
}

/**
 * Validates email format using regex
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Displays error message to the user
 * @param {string} message - Error message to display
 */
function showError(message) {
  const errorContainer = document.getElementById('errorMessage');
  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
  } else {
    console.error(message);
  }
  showLoadingState(false);
}

/**
 * Toggles loading state of the form
 * @param {boolean} isLoading - True to show loading, false to hide
 */
function showLoadingState(isLoading) {
  const submitButton = document.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? 'Logging in...' : 'Login';
  }
}

/**
 * Submits login credentials to the server
 * @param {string} email - User email
 * @param {string} password - User password
 */
function submitLogin(email, password) {
  // Prepare request data
  const loginData = {
    email: email,
    password: password
  };
  
  // Send POST request to login endpoint
  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      // Redirect to dashboard or home page on successful login
      window.location.href = data.redirectUrl || '/dashboard';
    } else {
      showError(data.message || 'Login failed. Please try again.');
    }
  })
  .catch(error => {
    console.error('Login error:', error);
    showError('An error occurred during login. Please try again later.');
  })
  .finally(() => {
    showLoadingState(false);
  });
}
