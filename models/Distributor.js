// models/Distributor.js
import mongoose from 'mongoose';

const DistributorSchema = new mongoose.Schema({
  applicationId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String },
  companyName: { type: String, required: true },
  gstNumber: { type: String },
  businessType: { type: String },
  state: { type: String },
  city: { type: String, required: true },
  pincode: { type: String },
  
  // KYC Details
  aadhaarNumber: { type: String, required: true },
  aadhaarUrl: { type: String, required: true }, // Cloudinary link
  panNumber: { type: String, required: true },
  panUrl: { type: String, required: true }, // Cloudinary link
  
  experience: { type: String },
  interest: { type: String },
  message: { type: String },
  
  status: { type: String, default: 'Pending' }, // Pending, Approved, Rejected
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Distributor || mongoose.model('Distributor', DistributorSchema);