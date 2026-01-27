# 🎓 Aluminati - AI-Powered Alumni Network Platform

> A comprehensive alumni networking platform that bridges the gap between students and alumni through intelligent matching, real-time communication, and community engagement.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green.svg)](https://www.mongodb.com/)

## ✨ Features

### 🔔 **Core Features**
- **Real-time Notifications** - Stay updated with instant alerts for connections, jobs, and events
- **Smart Job Matching** - AI-powered job recommendations based on skills, location, and experience
- **Live Messaging** - Real-time chat using Socket.IO for instant communication
- **OAuth Social Login** - One-click login with Google, GitHub, and LinkedIn
- **Profile Management** - Comprehensive alumni profiles with photo uploads
- **Event Management** - Discover and register for alumni events
- **Mentorship Program** - Connect with experienced alumni for guidance
- **Alumni Directory** - Advanced search and filtering to find peers

### 🎯 **Smart Features**
- **Job Recommendations** - Get personalized job matches with match scores and reasons
- **Verification Badges** - Trusted alumni with verified status
- **Network Analytics** - Track your connections and engagement
- **AI Chatbot** - AlumiBot for quick assistance and navigation

## 🛠️ Tech Stack

### **Frontend**
- HTML5, CSS3, JavaScript (ES6+)
- TailwindCSS for styling
- Font Awesome icons
- AOS (Animate on Scroll)

### **Backend**
- Node.js & Express.js
- MongoDB with Mongoose ODM
- Socket.IO for real-time features
- JWT for authentication
- Passport.js for OAuth
- Multer for file uploads
- bcrypt.js for password hashing

### **Third-Party Integrations**
- Google OAuth 2.0
- GitHub OAuth
- LinkedIn OAuth
- MongoDB Atlas

## 📦 Installation

### **Prerequisites**
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### **Setup Steps**

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/aluminati.git
cd aluminati
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the root directory:
```env
MONGO_URI=mongodb://localhost:27017/aluminati
JWT_SECRET=your-super-secret-jwt-key
PORT=5000

# Optional OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

4. **Start MongoDB** (if using local)
```bash
mongod
```

5. **Run the application**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:5000
```

## 🚀 Deployment

### **Quick Deploy to Render**
1. Push code to GitHub
2. Sign up at [render.com](https://render.com)
3. Create new Web Service
4. Connect GitHub repo
5. Add environment variables
6. Deploy!

See [DEPLOYMENT.md](docs/deployment-guide.md) for detailed instructions.

## 📖 Usage

### **For Students/Alumni**
1. **Sign Up** with email or social login
2. **Complete Profile** with skills, experience, and location
3. **Browse Jobs** and get smart recommendations
4. **Connect** with alumni in your field
5. **Join Events** and mentorship programs
6. **Message** peers in real-time

### **For Administrators**
- Manage users and verify alumni
- Post job opportunities
- Organize events
- Monitor platform analytics

## 🏗️ Project Structure

```
aluminati/
├── backend/
│   ├── config/
│   │   └── passport.js          # OAuth strategies
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification
│   ├── models/
│   │   ├── User.js
│   │   ├── Profile.js
│   │   ├── Job.js
│   │   ├── Event.js
│   │   ├── Message.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── controllers/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── messageRoutes.js
│   │   └── ...
│   ├── db.js
│   └── server.js
├── frontend/
│   ├── index.html               # Landing page
│   ├── dashboard.html           # User dashboard
│   ├── messages.html            # Chat interface
│   ├── jobs.html
│   ├── events.html
│   ├── style.css
│   ├── script.js                # Global JS
│   └── api.js                   # API helper
├── .env
├── .gitignore
├── package.json
└── README.md
```

## 🎨 Screenshots

### Landing Page
Beautiful gradient hero with animated particles and feature showcase.

### Dashboard
Personalized dashboard with smart job recommendations, stats, and upcoming events.

### Real-time Chat
Instant messaging with conversation history and online status.

### Smart Job Matching
AI-powered recommendations with match scores and reasons.

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected API routes
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ Input validation and sanitization

## 📊 API Endpoints

### **Authentication**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/google` - Google OAuth
- `GET /auth/github` - GitHub OAuth

### **Jobs**
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/recommended` - Get smart recommendations
- `POST /api/jobs` - Create job posting

### **Messages**
- `GET /api/messages/conversations` - Get chat list
- `GET /api/messages/:userId` - Get messages with user
- `POST /api/messages` - Send message

### **Notifications**
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark as read

*Full API documentation coming soon*

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues

- File uploads are temporary on free hosting tiers
- OAuth requires setup of developer credentials
- Real-time features need WebSocket support

## 📝 Future Enhancements

- [ ] Verification badge system
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Video conferencing integration
- [ ] AI-powered resume builder
- [ ] Donation/fundraising module
- [ ] Advanced search filters
- [ ] Email notifications
- [ ] Dark mode enhancements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Akshay Jain** - Founder & Lead Developer
- **Ajay Gadiya** - [GitHub](https://github.com/YOUR_USERNAME)

## 🙏 Acknowledgments

- TailwindCSS for the amazing utility-first CSS framework
- Socket.IO for real-time communication
- MongoDB team for the excellent database
- Open source community

## 📞 Support

For support, email support@aluminati.com or join our Slack channel.

---

<div align="center">
Made with ❤️ by Akshay Jain & Ajay Gadiya

⭐ Star this repo if you found it helpful!
</div>
