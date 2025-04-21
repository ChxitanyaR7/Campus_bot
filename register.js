import authService from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    
    // Check if already logged in
    if (authService.isAuthenticated()) {
        window.location.href = 'main.html';
        return;
    }
    
    if (registerForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const statusMessage = document.createElement('div');
        statusMessage.className = 'status-message';
        registerForm.appendChild(statusMessage);
        
        // Add department field (optional enhancement)
        const departmentField = document.createElement('div');
        departmentField.className = 'form-group';
        departmentField.innerHTML = `
            <label for="department">Department</label>
            <select id="department" required>
                <option value="">Select Department</option>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Telecommunication">Electronics & Telecommunication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Artificial Intelligence & Machine Learning">AI & ML</option>
            </select>
        `;
        
        // Add student ID field (optional enhancement)
        const studentIdField = document.createElement('div');
        studentIdField.className = 'form-group';
        studentIdField.innerHTML = `
            <label for="studentId">Student ID</label>
            <input type="text" id="studentId" required placeholder="Enter your student ID">
        `;
        
        // Insert new fields before the password field
        const passwordFieldParent = passwordInput.parentElement;
        registerForm.insertBefore(departmentField, passwordFieldParent);
        registerForm.insertBefore(studentIdField, passwordFieldParent);
        
        // Email domain validation
        emailInput.addEventListener('blur', () => {
            const email = emailInput.value.trim();
            if (email && !email.toLowerCase().endsWith('@vcet.edu.in')) {
                showMessage('Only @vcet.edu.in email addresses are allowed', 'error');
                emailInput.classList.add('error');
            } else {
                emailInput.classList.remove('error');
                statusMessage.style.display = 'none';
            }
        });
        
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const confirmPassword = confirmPasswordInput.value.trim();
            const department = document.getElementById('department').value;
            const studentId = document.getElementById('studentId').value.trim();
            
            if (!name || !email || !password || !confirmPassword || !department || !studentId) {
                showMessage('Please fill in all fields', 'error');
                return;
            }
            
            if (!email.toLowerCase().endsWith('@vcet.edu.in')) {
                showMessage('Registration is restricted to @vcet.edu.in email addresses only', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showMessage('Passwords do not match', 'error');
                return;
            }
            
            if (password.length < 6) {
                showMessage('Password must be at least 6 characters long', 'error');
                return;
            }
            
            // Register the user
            const result = authService.registerUser({
                name: name,
                email: email,
                password: password,
                department: department,
                studentId: studentId
            });
            
            if (result.success) {
                showMessage('Registration successful! Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                showMessage(result.message, 'error');
            }
        });
        
        // Helper function to show status messages
        function showMessage(message, type) {
            statusMessage.textContent = message;
            statusMessage.className = `status-message ${type}`;
            statusMessage.style.display = 'block';
        }
    }
    
    // Mobile navigation functionality
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }
});