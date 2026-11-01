import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Agar user /admin par hai, par login page par NAHI hai
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const token = request.cookies.get('admin_auth_token')?.value;
    
    // Agar token nahi hai, toh redirect to naya login page
    if (token !== 'authenticated_true') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Agar user pehle se login hai aur wapas login page kholta hai, toh seedha dashboard bhej do
  if (path === '/admin/login') {
     const token = request.cookies.get('admin_auth_token')?.value;
     if (token === 'authenticated_true') {
         return NextResponse.redirect(new URL('/admin', request.url));
     }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};