// model/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SkillPost',
    required: false,
  },
  content: {
    type: String,
    required: true,
  },
  seen: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
