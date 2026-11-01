import { NextResponse } from 'next/server';

// 🟢 GET ki jagah POST kar diya hai taaki background mein auto-run na ho
export async function POST(request) {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  
  response.cookies.set({
    name: 'admin_auth_token',
    value: '',
    maxAge: 0,
    path: '/',
  });
  
  return response;
}