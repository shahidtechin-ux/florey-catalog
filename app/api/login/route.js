import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb'; // 🟢 Yahan db ki jagah mongodb kar diya hai
import Setting from '@/models/Setting';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Database connect karein
    await connectMongo(); // 🟢 Yahan bhi connectMongo kar diya hai

    // Database se admin settings fetch karein
    let settings = await Setting.findOne({});
    
    // Agar database mein settings nahi hain, toh default values use hongi
    const ADMIN_EMAIL = settings?.adminEmail || "floreyflorey11@gmail.com"; 
    const ADMIN_PASSWORD = settings?.adminPassword || "florey@123";

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true, message: "Login successful" });

      // Session Cookie set kar rahe hain (browser close hote hi logout ho jayega)
      response.cookies.set({
        name: 'admin_auth_token',
        value: 'authenticated_true',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ success: false, message: "Invalid Email or Password" }, { status: 401 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}