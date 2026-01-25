import mongoose from 'mongoose';
import Event from './backend/models/events.js';

console.log('Event model imported successfully:', Event);
console.log('Schema paths:', Object.keys(Event.schema.paths));
