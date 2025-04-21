import authService from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    // Check if already logged in
    if (authService.isAuthenticated()) {
        // Get the redirect parameter from URL if it exists
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPage = urlParams.get('redirect') || 'main.html';
        window.location.href = redirectPage;
        return;
    }
    
    // Check if loginForm exists before adding event listeners
    if (loginForm) {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const rememberCheckbox = document.getElementById('remember');
        const statusMessage = document.createElement('div');
        statusMessage.className = 'status-message';
        loginForm.appendChild(statusMessage);

        // Check if there are saved credentials
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail && emailInput) {
            emailInput.value = savedEmail;
            if (rememberCheckbox) {
                rememberCheckbox.checked = true;
            }
        }

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Login form submitted');

            if (!emailInput || !passwordInput) {
                console.error('Form inputs not found');
                return;
            }

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (!email || !password) {
                showMessage('Please fill in all fields', 'error');
                return;
            }

            // Save email if remember me is checked
            if (rememberCheckbox && rememberCheckbox.checked) {
                localStorage.setItem('rememberedEmail', email);
            } else if (rememberCheckbox) {
                localStorage.removeItem('rememberedEmail');
            }

            try {
                // Authenticate user
                const result = authService.loginUser(email, password);
                
                if (result.success) {
                    showMessage('Login successful! Redirecting...', 'success');
                    
                    // Get the redirect parameter from URL if it exists
                    const urlParams = new URLSearchParams(window.location.search);
                    const redirectPage = urlParams.get('redirect') || 'main.html';
                    
                    // Redirect after a short delay
                    setTimeout(() => {
                        window.location.href = redirectPage;
                    }, 1000);
                } else {
                    showMessage(result.message, 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                showMessage('Login failed. Please try again.', 'error');
            }
        });
        
        // Helper function to show status messages
        function showMessage(message, type) {
            statusMessage.textContent = message;
            statusMessage.className = `status-message ${type}`;
            statusMessage.style.display = 'block';
        }
    } else {
        console.error('Login form not found in the document');
    }

    // Mobile navigation functionality (if present on this page)
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }
});