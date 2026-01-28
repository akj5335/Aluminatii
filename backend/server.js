import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import passport from "passport";
import "./config/passport.js"; // This executes the config and registers strategies

const __dirname = dirname(fileURLToPath(import.meta.url));

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profile.js";
import eventRoutes from "./routes/eventRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import mentorshipRoutes from "./routes/mentorshipRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import oauthRoutes from "./routes/oauthRoutes.js";
import startupRoutes from "./routes/startupRoutes.js";

dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());
app.use(express.static(join(__dirname, '../frontend')));

// ===== Routes =====
app.use("/auth", authRoutes);
app.use("/profiles", profileRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/mentorship", mentorshipRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/startups", startupRoutes);
app.use("/auth", oauthRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Socket.io connection handling
const userSockets = new Map(); // Store userId -> socketId mapping

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // User joins with their ID
  socket.on('user_online', (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} is online`);
  });

  // Handle real-time message sending
  socket.on('send_message', async (data) => {
    const { recipientId, senderId, content } = data;

    // Send to recipient if online
    const recipientSocketId = userSockets.get(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('receive_message', data);
    }
  });

  socket.on("disconnect", () => {
    // Remove user from online users
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// Serve index.html for root route
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, '../frontend/index.html'));
});

// ===== MongoDB Connection =====
connectDB();

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, '0.0.0.0', () =>
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`)
).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
});
