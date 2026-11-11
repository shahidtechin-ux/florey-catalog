import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb'; 
import Setting from '@/models/Setting';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Database connect karein
    await connectMongo(); 

    // Database se admin settings fetch karein
    let settings = await Setting.findOne({});
    
    // Agar database mein settings nahi hain, toh default values use hongi
    const ADMIN_EMAIL = settings?.adminEmail || "floreyflorey11@gmail.com"; 
    const ADMIN_PASSWORD = settings?.adminPassword || "florey@123";

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true, message: "Login successful" });

      // 🟢 100% FIX: Cookie ko strong banaya gaya hai taaki page change par delete na ho
      response.cookies.set({
        name: 'admin_auth_token',
        value: 'authenticated_true',
        httpOnly: true, // Frontend nahi chhed payega, sirf Vercel ka server (middleware) padhega
        secure: process.env.NODE_ENV === 'production', // Vercel HTTPS par true rahega
        sameSite: 'lax', // Page refresh/change par token gayab nahi hoga
        path: '/', // Saare admin pages par valid rahega
        maxAge: 12 * 60 * 60, // 12 ghante tak logged in rahega
      });

      return response;
    }

    return NextResponse.json({ success: false, message: "Invalid Email or Password" }, { status: 401 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}