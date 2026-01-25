import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  connectionType: { type: String, enum: ['sameBatch', 'sameCompany', 'sameHometown', 'sharedEvent'], required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Connection', connectionSchema);
