
// This is a placeholder configuration for Background Jobs using BullMQ.
// To use this:
// 1. Install Redis and ensure it's running on localhost:6379 (or configure via env).
// 2. npm install bullmq
// 3. Uncomment and use the queues below.

/*
import { Queue } from 'bullmq';
import dotenv from 'dotenv';
dotenv.config();

const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
};

export const emailQueue = new Queue('email-queue', { connection });
export const notificationQueue = new Queue('notification-queue', { connection });
*/

export const emailQueue = {
    add: async (name, data) => {
        console.log(`[Mock Queue] Email Job added: ${name}`, data);
        return Promise.resolve();
    }
};

export const notificationQueue = {
    add: async (name, data) => {
        console.log(`[Mock Queue] Notification Job added: ${name}`, data);
        return Promise.resolve();
    }
};
