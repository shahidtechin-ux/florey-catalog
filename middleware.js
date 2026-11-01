import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const isLoginPage = path === '/admin/login';
  
  // 🟢 Aapki cookie ka naam aur value check
  const token = request.cookies.get('admin_auth_token')?.value;
  const isAuthenticated = token === 'authenticated_true';

  // Sirf /admin wale pages par rule lagana hai
  if (path.startsWith('/admin')) {
    
    // 1. Agar login nahi hai aur kisi bhi admin page par jane ki koshish kare -> Login par bhejo
    if (!isAuthenticated && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // 2. Agar pehle se login hai aur login page khole -> Wapas dashboard bhej do
    if (isAuthenticated && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};