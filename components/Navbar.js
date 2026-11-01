"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Catalogue loading state
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);
  
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Database se Catalogue open karne ka Smart Function (Smooth + Custom Title)
  const handleViewCatalogue = async () => {
    setIsCatalogLoading(true);
    try {
      const res = await fetch('/api/catalogue'); 
      const data = await res.json();

      const pdfLink = data?.data?.fileUrl || data?.data?.pdfUrl || data?.fileUrl || data?.catalogue?.fileUrl || data?.data?.url;

      if (data.success && pdfLink) {
        // Google Viewer embedded URL
        const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfLink)}&embedded=true`;
        
        // Naya blank tab kholna
        const newWindow = window.open('', '_blank');
        
        // Us naye tab mein custom Title aur PDF iframe likhna
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>FLOREY Catalogue</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { margin: 0; padding: 0; overflow: hidden; background-color: #333; }
                iframe { width: 100vw; height: 100vh; border: none; }
              </style>
            </head>
            <body>
              <iframe src="${viewerUrl}"></iframe>
            </body>
          </html>
        `);
        newWindow.document.close();
      } else {
        console.log("Database Response:", data); 
        alert("Catalogue ka link nahi mila. Backend check karein.");
      }
    } catch (error) {
      console.error("Catalog fetch error:", error);
      alert("Catalogue load karne mein error aayi.");
    } finally {
      setIsCatalogLoading(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  // Agar URL /admin se shuru hota hai, toh Navbar return mat karo (gayab kar do)
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <nav className={`sticky top-0 w-full z-[70] transition-all duration-300 border-b ${isScrolled ? 'bg-white shadow-md py-1 border-gray-100' : 'bg-white/95 backdrop-blur-xl py-2 sm:py-2.5 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-11 sm:h-14">
            
            {/* Left Side: Logo + FLOREY Brand Text */}
            <div className="flex-shrink-0 flex items-center relative z-[80]">
              <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setIsOpen(false)}>
                <div className="relative w-9 h-9 sm:w-11 sm:h-11 transition-transform duration-300 group-hover:scale-105">
                  <Image 
                    src="/images/logo.png" 
                    alt="FLOREY Logo" 
                    fill 
                    className="object-contain" 
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-900 font-black text-sm sm:text-base tracking-[0.2em] uppercase leading-none">FLOREY</span>
                  <span className="text-[7px] sm:text-[8px] text-gray-500 font-bold uppercase tracking-[0.15em] mt-0.5">Shajjad Electronics</span>
                </div>
              </Link>
            </div>

            {/* Right Side: Desktop Menu */}
            <div className="hidden lg:flex items-center gap-5 xl:gap-7">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link 
                    key={link.name} 
                    href={link.path} 
                    className={`relative font-bold text-[11px] xl:text-xs uppercase tracking-widest transition-colors duration-300 group ${isActive ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`}
                  >
                    {link.name}
                    <span className={`absolute -bottom-2 left-0 h-[2px] bg-red-600 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </Link>
                );
              })}
              
              <div className="flex items-center gap-3 pl-4 border-l border-gray-300">
                {/* Desktop Catalogue Button */}
                <button 
                  onClick={handleViewCatalogue}
                  disabled={isCatalogLoading}
                  className="text-gray-800 bg-gray-50 text-[10px] xl:text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-gray-300 hover:border-gray-500 hover:bg-gray-100 transition-all duration-300 disabled:opacity-50"
                >
                  {isCatalogLoading ? "LOADING..." : "VIEW CATALOGUE"}
                </button>
                
                <Link 
                  href="/distributorship" 
                  className="bg-red-600 text-white text-[10px] xl:text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full hover:bg-red-700 shadow-md transition-all duration-300"
                >
                  Distributorship
                </Link>
              </div>
            </div>

            {/* 🟢 FIXED: Mobile 3-Line Menu Button (Now Red Color) */}
            <div className="lg:hidden flex items-center justify-end relative z-[80]">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="flex flex-col justify-center items-center w-8 h-8 gap-1.5 focus:outline-none bg-transparent"
                aria-label="Toggle Menu"
              >
                <span className={`w-6 h-[2px] bg-red-600 rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[8px]' : ''}`}></span>
                <span className={`w-6 h-[2px] bg-red-600 rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-6 h-[2px] bg-red-600 rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[8px]' : ''}`}></span>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* FULL SCREEN MOBILE MENU (Hamesha Light Theme) */}
      <div className={`fixed inset-0 bg-white/95 backdrop-blur-2xl z-[60] transition-all duration-500 ease-in-out flex flex-col pt-20 px-6 lg:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        
        <div className="absolute top-10 right-0 w-[150px] h-[150px] bg-red-600/15 blur-[70px] rounded-full pointer-events-none"></div>
        
        <div className="flex flex-col gap-5 relative z-10 w-full h-full overflow-y-auto pb-8 mt-4">
          
          <div className="flex flex-col gap-4">
            {navLinks.map((link, index) => (
              <Link 
                key={link.name} 
                href={link.path} 
                onClick={() => setIsOpen(false)} 
                className={`text-base font-bold text-gray-800 uppercase tracking-[0.15em] transition-all duration-500 transform hover:text-red-600 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                style={{ transitionDelay: `${index * 40}ms` }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div 
            className={`w-full h-[1px] bg-gray-200 my-2 transition-all duration-500 ${isOpen ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
            style={{ transitionDelay: '200ms', transformOrigin: 'left' }}
          ></div>

          <div className="flex flex-col gap-3">
            {/* Mobile Catalogue Button */}
            <button 
              onClick={() => {
                setIsOpen(false);
                handleViewCatalogue();
              }}
              disabled={isCatalogLoading}
              className={`w-full text-center text-gray-700 bg-gray-50 border border-gray-300 hover:bg-gray-100 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} disabled:opacity-50`}
              style={{ transitionDelay: '250ms' }}
            >
              {isCatalogLoading ? "LOADING..." : "VIEW CATALOGUE"}
            </button>
            
            <Link 
              href="/distributorship" 
              onClick={() => setIsOpen(false)} 
              className={`w-full text-center bg-red-600 text-white py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest shadow-md transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
              style={{ transitionDelay: '300ms' }}
            >
              Get Distributorship
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}