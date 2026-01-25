# Aluminati - AI-Powered Alumni Engagement Platform

## Overview

Aluminati is a comprehensive alumni management system designed to foster connections, mentorship, and professional growth among alumni, current students, and faculty. The platform leverages AI-powered features to provide intelligent matching, networking, and career insights.

## Features

### Core Functionality
- **User Authentication**: Secure registration and login with JWT tokens
- **Profile Management**: Detailed alumni profiles with professional information
- **Real-time Messaging**: Socket.io-powered instant messaging
- **Event Management**: Create and manage alumni events
- **Job Board**: Post and discover career opportunities
- **Mentorship Program**: AI-facilitated mentor-mentee matching
- **Posts & Content**: Share updates and engage with the community
- **Notifications**: Stay updated on important activities
- **Admin Panel**: Administrative controls and user management

### AI-Powered Features
- **Smart Networking**: Automated connection suggestions
- **Predictive Career Insights**: AI-driven career recommendations
- **Intelligent Job Matching**: Advanced job-alumni pairing
- **Event Discovery**: AI-curated event recommendations
- **Adaptive Learning**: Personalized recommendations based on interactions

### Gamification
- **Leaderboard**: Track community engagement
- **Achievement Badges**: Unlock rewards for contributions
- **Points System**: Earn points for various activities
- **Challenges & Quests**: Monthly engagement challenges

## Technology Stack

### Backend
- **Node.js** with **Express.js** framework
- **MongoDB** with **Mongoose** ODM
- **Socket.io** for real-time communication
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **QRCode** for generating QR codes

### Frontend
- **HTML5**, **CSS3**, **JavaScript**
- **Tailwind CSS** for styling
- **Google Fonts** (Poppins & Outfit)
- Responsive design with mobile-first approach

### Additional Tools
- **Nodemon** for development
- **CORS** for cross-origin requests
- **Dotenv** for environment variables

## Project Structure

```
aluminati/
├── backend/
│   ├── models/          # MongoDB schemas
│   │   ├── User.js
│   │   ├── Profile.js
│   │   ├── Posts.js
│   │   ├── Connection.js
│   │   ├── Event.js
│   │   ├── Job.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   └── Content.js
│   ├── routes/          # API routes
│   │   ├── authRoutes.js
│   │   ├── profile.js
│   │   ├── postRoutes.js
│   │   ├── connectionRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── contentRoutes.js
│   │   ├── adminRoutes.js
│   │   └── controllers/  # Route controllers
│   ├── middleware/      # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   ├── db.js            # Database connection
│   ├── server.js        # Main server file
│   └── supabaseClient.js # Supabase integration
├── frontend/
│   ├── index.html       # Landing page
│   ├── style.css        # Custom styles
│   ├── script.js        # Frontend logic
│   ├── api.js           # API integration
│   ├── posts.html
│   ├── profile.html
│   ├── events.html
│   ├── jobs.html
│   ├── messages.html
│   ├── notifications.html
│   ├── directory.html
│   ├── mentorship.html
│   ├── success.html
│   ├── leaderboard.html
│   ├── admin.html
│   └── Employees.tsx
├── package.json
├── TODO.md
└── README.md
```

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aluminati
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory with:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: Open `frontend/index.html` in your browser
   - Backend API: `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info

### Profiles
- `GET /profiles` - Get all profiles
- `GET /profiles/:id` - Get specific profile
- `PUT /profiles/:id` - Update profile

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Posts
- `GET /posts` - Get all posts
- `POST /posts` - Create new post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post

### Connections
- `GET /connections` - Get user connections
- `POST /connections` - Send connection request
- `PUT /connections/:id` - Accept/reject connection

### Jobs
- `GET /jobs` - Get all job postings
- `POST /jobs` - Create job posting
- `PUT /jobs/:id` - Update job posting
- `DELETE /jobs/:id` - Delete job posting

### Messages
- `GET /messages` - Get user messages
- `POST /messages` - Send message

### Notifications
- `GET /notifications` - Get user notifications
- `PUT /notifications/:id` - Mark as read

## Database Models

### User
- name, email, password
- Timestamps

### Profile
- user (reference), collegeId, branch, gender
- contact, graduationYear, degree, company, designation
- location, socialLinks, achievements, bio, photoURL
- isPublic, updatedAt

### Event
- title, description, date, location
- organizer, attendees, category
- Timestamps

### Job
- title, company, description, requirements
- salary, location, type, postedBy
- Timestamps

### Post
- content, author, likes, comments
- Timestamps

### Message
- sender, receiver, content
- Timestamps

### Notification
- user, type, message, isRead
- Timestamps

## Frontend Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Mode**: Theme toggle functionality
- **Animations**: Scroll-triggered fade-ins and hover effects
- **AI Chatbot**: Interactive AI assistant bubble
- **Particle Background**: Animated background effects
- **Glassmorphism**: Modern UI with glass-like elements
- **Testimonials Carousel**: Dynamic testimonial display
- **Gamification UI**: Leaderboard and badge animations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

For questions or support, please contact the development team.

---

**Note**: This README is based on the current state of the codebase as analyzed from the provided files. Some features may be in development or require additional setup.
