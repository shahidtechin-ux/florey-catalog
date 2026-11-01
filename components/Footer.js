"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Agar URL '/admin' se start hota hai (jaise login page), toh footer mat dikhao
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products Catalog', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Become a Distributor', path: '/distributorship' }
  ];

  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 font-sans relative overflow-hidden">
      
      {/* Subtle Top Border Highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-5 lg:pr-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Image 
                  src="/images/logo.png" 
                  alt="FLOREY Logo" 
                  fill 
                  className="object-contain drop-shadow-sm" 
                />
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-black text-gray-900 tracking-widest uppercase leading-none">FLOREY</h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1 font-bold">Shajjad Electronics</p>
              </div>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed pr-4 sm:pr-0 font-medium">
              Whole World Admire us. Premium Electrical Accessories, Modular Switches, and Wires designed for safety, elegance, and durability.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-gray-900 font-black text-sm sm:text-base mb-5 sm:mb-6 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.path} className="text-sm text-gray-600 hover:text-red-600 hover:translate-x-1.5 transition-all duration-300 inline-block font-semibold py-1 sm:py-0">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-gray-900 font-black text-sm sm:text-base mb-5 sm:mb-6 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              Contact Us
            </h3>
            <ul className="space-y-4 sm:space-y-5">
              
              {/* Address */}
              <li>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Noida+Sector+69+B+-+19,+Uttar+Pradesh,+India" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 sm:gap-4 group cursor-pointer"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-600 transition-colors">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <span className="text-sm text-gray-600 mt-0.5 leading-relaxed group-hover:text-gray-900 transition-colors text-left font-medium">
                    Noida Sector 69 B - 19<br/>Uttar Pradesh, India
                  </span>
                </a>
              </li>
              
              {/* Email */}
              <li>
                <a href="mailto:floreyflorey11@gmail.com" className="flex items-center gap-3 sm:gap-4 group">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-600 transition-colors">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors break-all font-semibold">floreyflorey11@gmail.com</span>
                </a>
              </li>

              {/* Phone */}
              <li>
                <a href="tel:+917065555127" className="flex items-center gap-3 sm:gap-4 group">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-600 transition-colors">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors tracking-widest font-semibold">+91 7065555127</span>
                </a>
              </li>

            </ul>
          </div>

          {/* Column 4: Actions */}
          <div className="flex flex-col items-start lg:items-end lg:text-right pt-2 sm:pt-4 lg:pt-0">
            <h3 className="text-gray-900 font-black text-sm sm:text-base mb-3 sm:mb-4 uppercase tracking-widest w-full text-left lg:text-right">Live Support</h3>
            <p className="text-sm text-gray-500 mb-5 sm:mb-6 leading-relaxed lg:max-w-[250px] lg:ml-auto font-medium">Need quick help or want to place an order? Get in touch with us.</p>
            
            <div className="flex flex-col gap-3.5 w-full">
              
              <a 
                href="https://wa.me/917065555127?text=Hello%20FLOREY%20Team,%20I%20want%20to%20know%20more%20about%20your%20products!" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 bg-gradient-to-r from-[#25D366] to-[#1da851] text-white px-5 sm:px-7 py-3.5 rounded-full font-bold transition-all duration-300 shadow-[0_8px_20px_rgba(37,211,102,0.25)] hover:shadow-[0_12px_25px_rgba(37,211,102,0.4)] hover:-translate-y-1 w-full text-sm sm:text-base"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964 1.003-3.588c-.608-1.033-.926-2.22-.926-3.442 0-4.665 3.793-8.455 8.458-8.455 4.661 0 8.453 3.791 8.455 8.455 0 4.666-3.792 8.455-8.455 8.455z"/>
                </svg>
                Chat on WhatsApp
              </a>

              <Link 
                href="/contact"
                className="group flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 px-5 sm:px-7 py-3.5 rounded-full font-bold transition-all duration-300 hover:border-red-600 hover:text-red-600 hover:bg-red-50 hover:-translate-y-1 w-full text-sm sm:text-base shadow-sm"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-red-600 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Contact Us Form
              </Link>

            </div>
          </div>

        </div>

        {/* 🟢 UPDATED: CENTERED Copyright Bar */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200 flex justify-center items-center">
          <p className="text-xs sm:text-sm text-gray-500 font-semibold tracking-wide text-center">
            © {new Date().getFullYear()} FLOREY (Shajjad Electronics). All rights reserved.
          </p>
        </div>
        
      </div>
    </footer>
  );
}