const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'campusbot',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
}

// User authentication functions
async function registerUser(userData) {
    try {
        // Check if email is from vcet.edu.in domain
        if (!userData.email.toLowerCase().endsWith('@vcet.edu.in')) {
            return {
                success: false,
                message: 'Registration is restricted to @vcet.edu.in email addresses only'
            };
        }
        
        // Check if user already exists
        const [existingUsers] = await pool.query(
            'SELECT email FROM users WHERE email = ?',
            [userData.email]
        );
        
        if (existingUsers.length > 0) {
            return {
                success: false,
                message: 'User with this email already exists'
            };
        }
        
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        
        // Insert new user
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, role, department, student_id) VALUES (?, ?, ?, ?, ?, ?)',
            [userData.name, userData.email, hashedPassword, userData.role || 'student', userData.department, userData.studentId]
        );
        
        return {
            success: true,
            message: 'User registered successfully',
            userId: result.insertId
        };
    } catch (error) {
        console.error('Registration error:', error);
        return {
            success: false,
            message: 'Registration failed due to an internal error'
        };
    }
}

async function loginUser(email, password) {
    try {
        // Get user from database
        const [users] = await pool.query(
            'SELECT user_id, name, email, password, role FROM users WHERE email = ?',
            [email]
        );
        
        if (users.length === 0) {
            return {
                success: false,
                message: 'Invalid email or password'
            };
        }
        
        const user = users[0];
        
        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            return {
                success: false,
                message: 'Invalid email or password'
            };
        }
        
        // Update last login time
        await pool.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?',
            [user.user_id]
        );
        
        // Create session
        const sessionId = require('crypto').randomBytes(64).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days session
        
        await pool.query(
            'INSERT INTO sessions (session_id, user_id, expires_at) VALUES (?, ?, ?)',
            [sessionId, user.user_id, expiresAt]
        );
        
        return {
            success: true,
            message: 'Login successful',
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            sessionId,
            expiresAt
        };
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            message: 'Login failed due to an internal error'
        };
    }
}

async function verifySession(sessionId) {
    try {
        const [sessions] = await pool.query(
            'SELECT s.session_id, s.user_id, s.expires_at, u.name, u.email, u.role ' +
            'FROM sessions s JOIN users u ON s.user_id = u.user_id ' +
            'WHERE s.session_id = ? AND s.expires_at > CURRENT_TIMESTAMP',
            [sessionId]
        );
        
        if (sessions.length === 0) {
            return {
                success: false,
                message: 'Invalid or expired session'
            };
        }
        
        const session = sessions[0];
        
        return {
            success: true,
            session: {
                id: session.session_id,
                userId: session.user_id,
                expiresAt: session.expires_at
            },
            user: {
                id: session.user_id,
                name: session.name,
                email: session.email,
                role: session.role
            }
        };
    } catch (error) {
        console.error('Session verification error:', error);
        return {
            success: false,
            message: 'Session verification failed due to an internal error'
        };
    }
}

async function logoutUser(sessionId) {
    try {
        await pool.query(
            'DELETE FROM sessions WHERE session_id = ?',
            [sessionId]
        );
        
        return {
            success: true,
            message: 'Logout successful'
        };
    } catch (error) {
        console.error('Logout error:', error);
        return {
            success: false,
            message: 'Logout failed due to an internal error'
        };
    }
}

async function getUserProfile(userId) {
    try {
        const [users] = await pool.query(
            'SELECT user_id, name, email, role, department, student_id, created_at, last_login ' +
            'FROM users WHERE user_id = ?',
            [userId]
        );
        
        if (users.length === 0) {
            return {
                success: false,
                message: 'User not found'
            };
        }
        
        const user = users[0];
        
        return {
            success: true,
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                studentId: user.student_id,
                createdAt: user.created_at,
                lastLogin: user.last_login
            }
        };
    } catch (error) {
        console.error('Get user profile error:', error);
        return {
            success: false,
            message: 'Failed to retrieve user profile due to an internal error'
        };
    }
}

// ...existing code...

async function saveChatMessage(userId, messageText, isBotResponse = false) {
    try {
        const [result] = await pool.query(
            'INSERT INTO chat_messages (user_id, message_text, is_bot_response) VALUES (?, ?, ?)',
            [userId, messageText, isBotResponse]
        );
        
        return {
            success: true,
            messageId: result.insertId
        };
    } catch (error) {
        console.error('Save chat message error:', error);
        return {
            success: false,
            message: 'Failed to save chat message'
        };
    }
}

async function getChatHistory(userId, limit = 50) {
    try {
        const [messages] = await pool.query(
            `SELECT 
                message_id,
                message_text,
                is_bot_response,
                created_at
            FROM chat_messages 
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT ?`,
            [userId, limit]
        );
        
        return {
            success: true,
            messages: messages.map(msg => ({
                id: msg.message_id,
                text: msg.message_text,
                isBotResponse: msg.is_bot_response === 1,
                timestamp: msg.created_at
            }))
        };
    } catch (error) {
        console.error('Get chat history error:', error);
        return {
            success: false,
            message: 'Failed to retrieve chat history'
        };
    }
}

async function updateUserProfile(userId, userData) {
    try {
        const updateFields = [];
        const updateValues = [];
        
        // Only update fields that are provided
        if (userData.name) {
            updateFields.push('name = ?');
            updateValues.push(userData.name);
        }
        
        if (userData.department) {
            updateFields.push('department = ?');
            updateValues.push(userData.department);
        }
        
        if (userData.password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
            updateFields.push('password = ?');
            updateValues.push(hashedPassword);
        }
        
        // Add userId to values array for WHERE clause
        updateValues.push(userId);
        
        if (updateFields.length === 0) {
            return {
                success: false,
                message: 'No fields to update'
            };
        }
        
        const query = `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`;
        
        await pool.query(query, updateValues);
        
        return {
            success: true,
            message: 'Profile updated successfully'
        };
    } catch (error) {
        console.error('Update user profile error:', error);
        return {
            success: false,
            message: 'Failed to update profile due to an internal error'
        };
    }
}

// Export functions
module.exports = {
    pool,
    testConnection,
    registerUser,
    loginUser,
    verifySession,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    saveChatMessage,
 getChatHistory
};