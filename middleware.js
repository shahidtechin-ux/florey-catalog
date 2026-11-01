import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const isLoginPage = path === '/admin/login';
  
  // Cookie padhna
  const token = request.cookies.get('admin_auth_token')?.value;
  const isAuthenticated = token === 'authenticated_true';

  // Sirf /admin aur uske andar ke routes ke liye check
  if (path.startsWith('/admin')) {
    
    // 1. Agar logged in NAHI hai aur kisi bhi admin page par jaye -> Login par bhejo
    if (!isAuthenticated && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // 2. Agar logged in HAI aur login page par jaye -> Dashboard bhej do
    if (isAuthenticated && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  
  return NextResponse.next();
}

// 🟢 100% FIX YAHAN HAI: Matcher mein exact '/admin' aur sub-paths dono add kiye hain
export const config = {
  matcher: [
    '/admin',
    '/admin/:path*'
  ],
};