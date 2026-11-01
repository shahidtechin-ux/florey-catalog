import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Distributor from '@/models/Distributor';
import { v2 as cloudinary } from 'cloudinary';
import nodemailer from 'nodemailer'; // 🟢 NAYA: Email ke liye

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

export async function GET() {
  try {
    await connectDB();
    const applications = await Distributor.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: applications });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    
    let aadhaarUrl = "";
    if (data.aadhaarData) {
      const uploadRes = await cloudinary.uploader.upload(data.aadhaarData, { folder: "florey_distributors" });
      aadhaarUrl = uploadRes.secure_url;
    }

    let panUrl = "";
    if (data.panData) {
      const uploadRes = await cloudinary.uploader.upload(data.panData, { folder: "florey_distributors" });
      panUrl = uploadRes.secure_url;
    }

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const appId = `DIST-2026-${randomId}`;

    const newDistributor = new Distributor({
      applicationId: appId,
      fullName: data.fullName,
      mobileNumber: data.mobileNumber,
      email: data.email,
      companyName: data.companyName,
      gstNumber: data.gstNumber,
      businessType: data.businessType,
      state: data.state,
      city: data.city,
      pincode: data.pincode,
      aadhaarNumber: data.aadhaarNumber,
      aadhaarUrl: aadhaarUrl,
      panNumber: data.panNumber,
      panUrl: panUrl,
      experience: data.experience,
      interest: data.interest,
      message: data.message,
      status: 'Pending'
    });

    await newDistributor.save();
    return NextResponse.json({ success: true, applicationId: appId });
  } catch (error) {
    console.error("Distributor API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 🟢 NAYA PUT METHOD (Status update + Email Sending)
export async function PUT(req) {
  try {
    await connectDB();
    const { id, status, messageText, email } = await req.json();
    
    // 1. Database mein status update karna
    await Distributor.findByIdAndUpdate(id, { status });

    // 2. Email Bhejna (Agar user ne email id di hai)
    if (email && messageText) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, // e.g., 'your.email@gmail.com'
          pass: process.env.EMAIL_PASS  // e.g., 'your-app-password'
        }
      });

      const mailOptions = {
        from: `"Shajjad Electronics" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Distributorship Application ${status} - FLOREY`,
        text: messageText,
      };

      await transporter.sendMail(mailOptions);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email/Status Update Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}