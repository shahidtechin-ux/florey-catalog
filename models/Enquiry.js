import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  referenceId: { type: String, required: true },
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, default: '' },
  enquiryType: { type: String, required: true },
  
  // Conditional fields (depending on enquiry type)
  productDetails: { type: String, default: '' }, 
  companyName: { type: String, default: '' },    
  cityState: { type: String, default: '' },      
  subject: { type: String, default: '' },        
  
  message: { type: String, required: true },
  status: { type: String, default: 'New' }, // Admin dashboard me track karne ke liye
}, { 
  timestamps: true // Ye automatically 'createdAt' aur 'updatedAt' date save kar dega
});

// Next.js backend (serverless) environments mein models baar-baar compile hote hain. 
// Isliye pehle check karte hain ki model exist karta hai ya nahi.
const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);

export default Enquiry;