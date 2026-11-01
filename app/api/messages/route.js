import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import MessageTemplate from '@/models/MessageTemplate';

// Saare templates fetch karne ke liye
export async function GET() {
  try {
    await connectMongo();
    const templates = await MessageTemplate.find({});
    return NextResponse.json({ success: true, data: templates });
  } catch (error) {
    console.error("Template fetch error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

// Template update ya naya create karne ke liye
export async function PUT(req) {
  try {
    await connectMongo();
    const { type, subject, body } = await req.json();
    
    // findOneAndUpdate me 'upsert: true' ka matlab hai agar pehle se nahi hai toh naya bana dega
    const template = await MessageTemplate.findOneAndUpdate(
      { type },
      { subject, body },
      { new: true, upsert: true } 
    );
    
    return NextResponse.json({ success: true, data: template });
  } catch (error) {
    console.error("Template update error:", error);
    return NextResponse.json({ success: false, message: "Update Failed" }, { status: 500 });
  }
}