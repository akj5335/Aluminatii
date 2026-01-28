import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Profile from './models/Profile.js';
import Startup from './models/Startup.js';
import Events from './models/Events.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('DB Connected'))
    .catch(err => console.error(err));

const seed = async () => {
    try {
        console.log('Clearing old data...');
        // await User.deleteMany({});
        // await Profile.deleteMany({});
        // await Startup.deleteMany({});
        // await Events.deleteMany({});
        // For safety, I won't delete all, just add new ones or you can uncomment above

        console.log('Creating Users...');
        const password = await bcrypt.hash('password123', 10);

        const users = [];
        for (let i = 0; i < 10; i++) {
            const user = await User.create({
                name: `Alumni User ${i}`,
                email: `user${i}@example.com`,
                password,
                college: 'National Institute of Technology',
                role: 'alumni',
                isVerified: true
            });
            users.push(user);
        }

        console.log('Creating Profiles...');
        const companies = ['Google', 'Microsoft', 'Amazon', 'StartUp Inc', 'TechCorp'];
        const locations = [
            { name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194 },
            { name: 'New York, NY', lat: 40.7128, lng: -74.0060 },
            { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
            { name: 'Bangalore, India', lat: 12.9716, lng: 77.5946 },
            { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 }
        ];

        for (let i = 0; i < users.length; i++) {
            const loc = locations[i % locations.length];
            await Profile.create({
                user: users[i]._id,
                collegeId: `COL-${1000 + i}`,
                batchYear: 2020 + (i % 5), // 2020-2024
                branch: 'Computer Science',
                degree: 'B.Tech',
                company: companies[i % companies.length],
                designation: 'Software Engineer',
                location: loc.name,
                coordinates: { lat: loc.lat, lng: loc.lng },
                bio: `Passionate engineer working at ${companies[i % companies.length]}.`,
                skills: [{ name: 'JavaScript' }, { name: 'Python' }, { name: 'React' }],
                badges: [
                    { name: 'Early Adopter', icon: 'fa-solid fa-rocket' },
                    { name: 'Skill Sharer', icon: 'fa-solid fa-shapes' }
                ]
            });
        }

        console.log('Creating Startups...');
        await Startup.create({
            founder: users[0]._id,
            name: 'Nebula AI',
            tagline: 'AI for smarter galaxies',
            description: 'Building the next generation of interstellar AI agents.',
            stage: 'Seed',
            lookingFor: ['Investor', 'Co-founder'],
            logo: 'https://placehold.co/400x400/4F46E5/ffffff?text=N'
        });

        await Startup.create({
            founder: users[1]._id,
            name: 'GreenEarth',
            tagline: 'Sustainable tech for all',
            description: 'Recycling plastic into 3D printer filament.',
            stage: 'Series A',
            lookingFor: ['Hiring', 'Mentor'],
            logo: 'https://placehold.co/400x400/10B981/ffffff?text=G'
        });

        console.log('Creating Events with Roundtables...');
        const event = await Events.create({
            title: 'Global Tech Summit 2026',
            description: 'Join us for a day of innovation and networking.',
            date: new Date(Date.now() + 86400000 * 7), // 7 days later
            location: 'New York Convention Center',
            organizer: users[0]._id,
            roundtables: [
                { topic: 'AI Ethics', host: 'Dr. Sarah Smith', capacity: 10, attendees: [] },
                { topic: 'Startup Funding', host: 'Mark C.', capacity: 15, attendees: [] },
                { topic: 'Remote Work Culture', host: 'Jane D.', capacity: 8, attendees: [] }
            ]
        });

        console.log('Seed Data Created Successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
