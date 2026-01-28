import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  location: String,
  videoLink: String,
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  interactions: [{ type: String }],
  roundtables: [{
    topic: String,
    host: String,
    capacity: { type: Number, default: 10 },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Event", eventSchema);
