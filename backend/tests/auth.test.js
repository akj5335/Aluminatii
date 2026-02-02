import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/authRoutes.js';
import passport from 'passport';
import User from '../models/User.js'; // Import globally

// Mock app setup
const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use('/auth', authRoutes);

// Mock DB and Passport (Since we don't want to hit real DB in this unit test)
jest.mock('../models/User.js');
jest.mock('bcryptjs', () => ({
    genSalt: jest.fn(() => 'salt'),
    hash: jest.fn(() => 'hashedPassword'),
    compare: jest.fn(() => true)
}));
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'token'),
    verify: jest.fn(() => ({ id: 'userId' }))
}));
// Mock authentication middleware to bypass real checks
jest.mock('../middleware/authMiddleware.js', () => (req, res, next) => {
    req.user = { id: 'userId' };
    next();
});

describe('Auth API', () => {
    it('should register a new user', async () => {
        // Mock User.findOne to return null (no user exists)
        User.findOne = jest.fn().mockResolvedValue(null);
        User.prototype.save = jest.fn().mockResolvedValue({ _id: 'userId', name: 'Test' });

        const res = await request(app)
            .post('/auth/register')
            .send({
                name: 'Test',
                email: 'test@example.com',
                password: 'password123',
                college: 'Test College'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should login an existing user', async () => {
        User.findOne = jest.fn().mockResolvedValue({
            _id: 'userId',
            name: 'Test',
            email: 'test@example.com',
            password: 'hashedPassword'
        });

        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
