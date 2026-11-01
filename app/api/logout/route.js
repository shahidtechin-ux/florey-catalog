import { NextResponse } from 'next/server';

export async function GET(request) {
  // Cookie ko expire karke login page par bhej dena
  const response = NextResponse.redirect(new URL('/admin/login', request.url));
  response.cookies.set({
    name: 'admin_auth_token',
    value: '',
    maxAge: 0,
    path: '/',
  });
  return response;
}