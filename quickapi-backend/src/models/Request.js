import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  },
  url: {
    type: String,
    required: true
  },
  headers: [{
    key: String,
    value: String
  }],
  body: {
    type: String
  },
  auth: {
    authType: String,
    token: String
  },
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Request', requestSchema);
