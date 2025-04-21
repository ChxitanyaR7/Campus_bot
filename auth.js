// auth.js - Enhanced Authentication service for VCET CampusBot

class AuthService {
    constructor() {
        // Initialize users from localStorage or create empty array (temporary until DB integration)
        this.users = JSON.parse(localStorage.getItem('campusbot_users')) || [];
        this.init();
        
        // Connect to the database (this would be implemented in your server-side code)
        // this.dbConnection = new DBConnection();
    }

    init() {
        // Check if authentication is already initialized
        if (!localStorage.getItem('campusbot_auth_initialized')) {
            // Add a default admin user if no users exist
            if (this.users.length === 0) {
                this.registerUser({
                    name: 'Admin User',
                    email: 'admin@vcet.edu.in',
                    password: 'admin123',
                    role: 'admin'
                });
            }
            localStorage.setItem('campusbot_auth_initialized', 'true');
        }

        // Protect routes that require authentication
        this.protectRoutes();
    }

    // Validate email domain to ensure it's from vcet.edu.in
    validateEmailDomain(email) {
        // Check if email ends with @vcet.edu.in
        return email.toLowerCase().endsWith('@vcet.edu.in');
    }

    // Register a new user with enhanced validation
    registerUser(userData) {
        // Check if user already exists
        if (this.users.some(user => user.email === userData.email)) {
            return {
                success: false,
                message: 'User with this email already exists'
            };
        }

        // Validate email domain
        if (!this.validateEmailDomain(userData.email)) {
            return {
                success: false,
                message: 'Registration is restricted to @vcet.edu.in email addresses only'
            };
        }

        // In a real app, you would hash the password here
        const newUser = {
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            password: userData.password, // Should be hashed in production
            role: userData.role || 'student',
            department: userData.department || null,
            studentId: userData.studentId || null,
            createdAt: new Date().toISOString(),
            lastLogin: null
        };

        // Add user to the database
        this.users.push(newUser);
        this._saveUsers();

        // In production, this would be a database insert
        // const result = await this.dbConnection.query(
        //     'INSERT INTO users (name, email, password, role, department, student_id) VALUES (?, ?, ?, ?, ?, ?)',
        //     [userData.name, userData.email, hashedPassword, userData.role || 'student', userData.department, userData.studentId]
        // );

        return {
            success: true,
            message: 'User registered successfully'
        };
    }

    // Authenticate user login
    loginUser(email, password) {
        const user = this.users.find(user => user.email === email);

        // Check if user exists and password matches
        if (!user || user.password !== password) {
            return {
                success: false,
                message: 'Invalid email or password'
            };
        }

        // In production, this would verify against database
        // const user = await this.dbConnection.query(
        //     'SELECT user_id, name, email, password, role FROM users WHERE email = ?',
        //     [email]
        // );
        // if (!user || !comparePassword(password, user.password)) { ... }

        // Generate a session token (in a real app, use a more secure method)
        const sessionToken = this._generateToken();
        
        // Update last login time
        user.lastLogin = new Date().toISOString();
        this._saveUsers();
        
        // Store session info in localStorage
        localStorage.setItem('campusbot_auth_token', sessionToken);
        localStorage.setItem('campusbot_user_email', user.email);
        localStorage.setItem('campusbot_user_name', user.name);
        localStorage.setItem('campusbot_user_role', user.role);
        localStorage.setItem('campusbot_user_id', user.id);
        localStorage.setItem('isLoggedIn', 'true');

        return {
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }

    // Check if user is authenticated
    isAuthenticated() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    // Get user role
    getUserRole() {
        return localStorage.getItem('campusbot_user_role') || 'student';
    }

    // Check if user has admin privileges
    isAdmin() {
        return this.getUserRole() === 'admin';
    }

    // Log out the current user
    logoutUser() {
        localStorage.removeItem('campusbot_auth_token');
        localStorage.removeItem('campusbot_user_email');
        localStorage.removeItem('campusbot_user_name');
        localStorage.removeItem('campusbot_user_role');
        localStorage.removeItem('campusbot_user_id');
        localStorage.removeItem('isLoggedIn');
        
        // Redirect to login page
        window.location.href = '/login.html';
    }

    // Protect pages that require authentication
    protectRoutes() {
        // List of pages that don't require authentication
        const publicPages = ['login.html', 'register.html', 'index.html'];
        
        // Get current page filename
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // If the current page is not public and user is not authenticated, redirect to login
        if (!publicPages.includes(currentPage) && !this.isAuthenticated()) {
            window.location.href = '/login.html?redirect=' + encodeURIComponent(currentPage);
            return;
        }
        
        // Admin-only pages
        const adminPages = ['admin-dashboard.html', 'manage-users.html', 'manage-announcements.html'];
        if (adminPages.includes(currentPage) && !this.isAdmin()) {
            window.location.href = '/main.html';
        }
    }

    // Get current user information
    getCurrentUser() {
        if (!this.isAuthenticated()) {
            return null;
        }
        
        const email = localStorage.getItem('campusbot_user_email');
        const name = localStorage.getItem('campusbot_user_name');
        const role = localStorage.getItem('campusbot_user_role');
        const id = localStorage.getItem('campusbot_user_id');
        
        return { id, email, name, role };
    }

    // Save users to localStorage
    _saveUsers() {
        localStorage.setItem('campusbot_users', JSON.stringify(this.users));
    }

    // Generate a simple token (would be more secure in a real app)
    _generateToken() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
}

// Initialize the authentication service
const authService = new AuthService();

// Export the service
export default authService;