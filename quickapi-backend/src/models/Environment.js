import mongoose from 'mongoose';

const environmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  variables: [{
    key: String,
    value: String
  }],
  isActive: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model('Environment', environmentSchema);
