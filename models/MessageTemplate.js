import mongoose from 'mongoose';

const MessageTemplateSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true, 
    unique: true // 'approve', 'reject', ya 'received'
  },
  subject: { 
    type: String, 
    required: true 
  },
  body: { 
    type: String, 
    required: true 
  },
}, { timestamps: true });

export default mongoose.models.MessageTemplate || mongoose.model('MessageTemplate', MessageTemplateSchema);