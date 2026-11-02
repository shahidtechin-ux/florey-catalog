"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false); 

  useEffect(() => {
    document.title = "Admin Dashboard | Shajjad Electronics";
    const notificationsRead = localStorage.getItem('notificationsRead');
    if (notificationsRead !== 'true') {
       setHasUnread(true);
    }
  }, [pathname]);

  const handleMarkAllRead = () => {
     setHasUnread(false);
     setIsNotifOpen(false);
     localStorage.setItem('notificationsRead', 'true');
  };

  // 🟢 100% FIX: Logout ko sahi function se chalaya hai
  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      // Logout hone ke baad turant login page par bhej do
      window.location.href = '/admin/login';
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (pathname === '/admin/login') {
    return (
      <>
        <title>Admin Login | Shajjad Electronics</title>
        {children}
      </>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Products', path: '/admin/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { name: 'Distributorship', path: '/admin/distributors', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { name: 'Catalogue CMS', path: '/admin/catalogue', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { name: 'Message Centre', path: '/admin/messages', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { name: 'Customer Enquiries', path: '/admin/enquiries', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { name: 'Settings', path: '/admin/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex h-screen bg-gray-50 font-sans overflow-hidden w-full max-w-[100vw]">
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <aside className={`absolute md:relative w-64 h-full bg-gray-900 text-white flex-col shadow-2xl z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex shrink-0`}>
        <div className="h-20 sm:h-24 flex items-center px-4 sm:px-6 border-b border-gray-800 shrink-0">
          
          <div className="w-12 h-12 sm:w-14 sm:h-14 mr-3 relative flex items-center justify-center shrink-0">
            <Image src="/images/logo.png" alt="Logo" fill className="object-contain drop-shadow-[0_0_8px_rgba(220,38,38,0.4)]" />
          </div>
          
          <div className="flex flex-col justify-center">
            <h1 className="text-lg sm:text-xl font-bold tracking-wider leading-tight uppercase">FLOREY</h1>
            <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium tracking-[0.15em] mt-0.5 uppercase">Shajjad Electronics</p>
          </div>
          
          <button onClick={() => setIsSidebarOpen(false)} className="ml-auto md:hidden text-gray-400 hover:text-white p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.name} href={item.path} onClick={() => setIsSidebarOpen(false)}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer ${
                  isActive ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}>
                  <svg className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                  </svg>
                  <span className="font-medium text-sm truncate">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800 shrink-0">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-red-400 hover:text-white hover:bg-red-600 rounded-xl transition-colors shadow-sm cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout Admin
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      {/* 🟢 FIX: Added min-w-0 aur overflow-x-auto daala hai */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full min-w-0">
        
        <header className="h-20 sm:h-24 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 sm:px-8 z-10 shrink-0 shadow-md">
          
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-gray-400 hover:text-white transition-colors p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            
            <div className="flex flex-col">
              <h2 className="text-lg sm:text-2xl font-bold text-white tracking-wide leading-tight truncate">
                FLOREY Admin Console
              </h2>
              <p className="text-[9px] sm:text-xs text-gray-400 font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase mt-0.5 sm:mt-1">
                Administration Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 relative">
            
            {/* NOTIFICATION BELL */}
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="w-10 h-10 sm:w-11 sm:h-11 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all relative border border-gray-700 shrink-0"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {hasUnread && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-gray-800 rounded-full animate-pulse"></span>
              )}
            </button>

            {/* NOTIFICATION DROPDOWN MENU */}
            {isNotifOpen && (
              <div className="absolute top-14 right-14 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-black text-gray-900">Notifications</span>
                  <button 
                    onClick={handleMarkAllRead} 
                    className="text-xs text-red-600 font-bold hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="flex flex-col max-h-[350px] overflow-y-auto">
                  
                  <Link href="/admin/enquiries" onClick={() => setIsNotifOpen(false)} className="px-4 py-3.5 hover:bg-gray-50 border-b border-gray-50 flex items-start gap-3 transition-colors">
                    <div className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full shrink-0"></div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 leading-tight">New Customer Enquiry</p>
                      <p className="text-[11px] text-gray-500 mt-1">A customer has submitted a new query.</p>
                      <p className="text-[10px] font-medium text-gray-400 mt-1">Just now</p>
                    </div>
                  </Link>

                  <Link href="/admin/distributors" onClick={() => setIsNotifOpen(false)} className="px-4 py-3.5 hover:bg-gray-50 border-b border-gray-50 flex items-start gap-3 transition-colors">
                    <div className="w-2 h-2 mt-1.5 bg-green-500 rounded-full shrink-0"></div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 leading-tight">New Distributorship Application</p>
                      <p className="text-[11px] text-gray-500 mt-1">Review the latest partnership request.</p>
                      <p className="text-[10px] font-medium text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  </Link>

                  <Link href="/admin/products" onClick={() => setIsNotifOpen(false)} className="px-4 py-3.5 hover:bg-gray-50 border-b border-gray-50 flex items-start gap-3 transition-colors">
                    <div className="w-2 h-2 mt-1.5 bg-purple-500 rounded-full shrink-0"></div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 leading-tight">Product Update</p>
                      <p className="text-[11px] text-gray-500 mt-1">Your recent product changes are live.</p>
                      <p className="text-[10px] font-medium text-gray-400 mt-1">Yesterday</p>
                    </div>
                  </Link>

                  <div className="px-4 py-3.5 hover:bg-gray-50 flex items-start gap-3 transition-colors cursor-pointer">
                    <div className="w-2 h-2 mt-1.5 bg-gray-400 rounded-full shrink-0"></div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 leading-tight">System Alerts</p>
                      <p className="text-[11px] text-gray-500 mt-1">Server resources and database are optimal.</p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* SECURITY / ADMIN ICON */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer border border-gray-700 shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            
          </div>
        </header>

        {/* 🟢 YAHAN OVERFLOW FIX LAGAYA GAYA HAI */}
        <div className="flex-1 overflow-y-auto overflow-x-auto w-full bg-gray-50 p-4 sm:p-8">
          <div className="min-w-fit w-full">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}