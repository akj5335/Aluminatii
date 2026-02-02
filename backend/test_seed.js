import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

console.log('Testing seed script...');
console.log('Mongo URI:', process.env.MONGO_URI ? 'Defined' : 'Undefined');

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('DB Connected');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
