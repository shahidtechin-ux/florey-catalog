import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  // Business Profile
  brandName: { type: String, default: "FLOREY" },
  companyName: { type: String, default: "Shajjad Electronics" },
  officialEmail: { type: String, default: "info@shajjadelectronics.com" },
  supportPhone: { type: String, default: "+91 98765 43210" },
  officeAddress: { type: String, default: "" },
  
  // Admin Details
  adminName: { type: String, default: "Admin User" },
  adminEmail: { type: String, default: "floreyflorey11@gmail.com" },
  adminPassword: { type: String, default: "florey@123" }, // 🟢 YEH FIELD ADD KI GAYI HAI JHO PASSWORD SAVE KAREGI
  
  // System & Security
  acceptDistributors: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);