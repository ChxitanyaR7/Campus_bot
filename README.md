# VCET CampusBot 🤖

A comprehensive campus assistance system featuring an AI-powered chatbot and interactive map navigation for Vidyavardhini College of Engineering and Technology (VCET).

## 🌟 Features

### Authentication System
- Secure user registration and login
- JWT-based authentication
- Role-based access control
- Password encryption

### Interactive Campus Map
- Multi-floor navigation
- Real-time room location
- Search functionality
- Interactive clickable areas
- Building and facility information

### AI Chatbot
- Real-time chat interface
- Persistent chat history
- Context-aware responses
- Campus-specific information
- Quick response categories

### User Interface
- Responsive design
- Dark mode support
- Mobile-friendly layout
- Intuitive navigation
- Loading indicators

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3 (with Flexbox/Grid)
- JavaScript (ES6+)
- Font Awesome Icons

### Backend
- Node.js
- Express.js
- MySQL Database
- JWT Authentication

### Development Tools
- VS Code
- Git & GitHub
- npm
- Postman

## 📥 Installation

1. Clone the repository
```bash
git clone https://github.com/ChxitanyaR7/vcet-chatbot.git
cd vcet-chatbot
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Create .env file
cp .env.example .env

# Add your configurations
DB_HOST=localhost
DB_USER=your_username
DB_PASS=your_password
DB_NAME=vcet_chatbot
JWT_SECRET=your_jwt_secret
```

4. Initialize database
```bash
# Run MySQL scripts
mysql -u your_username -p vcet_chatbot < database/init.sql
```

5. Start the server
```bash
npm start
```

## 🗂️ Project Structure

```
## 📂 Complete Project Structure

vcet-chatbot/
├── node_modules/
├── public/
│   ├── assets/
│   │   ├── Academic-calender.pdf
│   │   └── logo.jpg
│   │
│   ├── scripts/
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── db.js
│   │   ├── login.js
│   │   ├── main.js
│   │   ├── main-test.js
│   │   ├── map.js
│   │   ├── proj.js
│   │   └── register.js
│   │
│   ├── styles/
│   │   ├── auth.css
│   │   ├── chat.css
│   │   ├── index.css
│   │   ├── login.css
│   │   ├── main.css
│   │   ├── map.css
│   │   └── proj.css
│   │
│   ├── about.html
│   ├── app.js
│   ├── contact.html
│   ├── index.html
│   ├── login.html
│   ├── main.html
│   ├── map.html
│   ├── proj.html
│   ├── register.html
│   └── services.html
│
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── server.js
└── service-account-key.json
```

## 🚀 Usage

1. Register a new account or login
2. Access the main dashboard
3. Use the chat interface for queries
4. Navigate campus using interactive map
5. View and manage chat history

## 💡 Contributing

1. Fork the repository
2. Create your feature branch
```bash
git checkout -b feature/AmazingFeature
```
3. Commit your changes
```bash
git commit -m 'Add some AmazingFeature'
```
4. Push to the branch
```bash
git push origin feature/AmazingFeature
```
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Acknowledgments

- VCET Faculty for their support
- Open source community


Project Link: [https://github.com/ChxitanyaR7/vcet-chatbot](https://github.com/ChxitanyaR7/vcet-chatbot)
