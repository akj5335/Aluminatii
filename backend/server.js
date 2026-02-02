console.log("Starting Server Process...");
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
import leaderboardRoutes from "./routes/leaderboardRoutes.js";

dotenv.config();
import logger from './config/logger.js';

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

// Request Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Socket.io connection handling
const userSockets = new Map(); // Store userId -> socketId mapping

app.use((req, res, next) => {
  req.io = io;
  req.userSockets = userSockets;
  next();
});

// Initialize Passport
app.use(passport.initialize());
app.use(express.static(join(__dirname, '../frontend')));

// ===== Routes =====
import { authLimiter, apiLimiter } from "./middleware/limiter.js";

app.use("/auth", authLimiter, authRoutes); // Apply strict limiter to auth
app.use("/profiles", apiLimiter, profileRoutes);
app.use("/api/events", apiLimiter, eventRoutes);
app.use("/api/posts", apiLimiter, postRoutes);
app.use("/api/jobs", apiLimiter, jobRoutes);
app.use("/api/leaderboard", apiLimiter, leaderboardRoutes);
app.use("/api/mentorship", apiLimiter, mentorshipRoutes);
app.use("/api/notifications", apiLimiter, notificationRoutes);
app.use("/api/upload", apiLimiter, uploadRoutes);
app.use("/api/messages", apiLimiter, messageRoutes);
app.use("/api/startups", apiLimiter, startupRoutes);
app.use("/auth", oauthRoutes);

import adminRoutes from "./routes/adminRoutes.js";
app.use("/api/admin", adminRoutes);

import analyticsRoutes from "./routes/analyticsRoutes.js";
app.use("/api/analytics", analyticsRoutes);

import chatbotRoutes from "./routes/chatbotRoutes.js";
app.use("/api/chatbot", chatbotRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // User joins with their ID
  socket.on('join_chat', (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} - ${socket.id} joined chat`);
    io.emit('user_status', { userId, status: 'online' });
  });

  // Handle typing events
  socket.on('typing', ({ recipientId }) => {
    const recipientSocketId = userSockets.get(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('typing', { senderId: socket.handshake.query.userId }); // or however you track sender
    }
  });

  socket.on('stop_typing', ({ recipientId }) => {
    const recipientSocketId = userSockets.get(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('stop_typing', { senderId: socket.handshake.query.userId });
    }
  });

  socket.on("disconnect", () => {
    // Remove user from online users
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        console.log(`User ${userId} disconnected`);
        io.emit('user_status', { userId, status: 'offline' });
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

// ===== Middleware =====
import errorHandler from "./middleware/errorHandler.js";
app.use(errorHandler);

// ===== Swagger UI =====
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swaggerConfig.js';
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, '0.0.0.0', () =>
  logger.info(`🚀 Server running on http://localhost:${PORT} | Docs at http://localhost:${PORT}/api-docs`)
).on('error', (err) => {
  logger.error('❌ Server failed to start:', err);
});
