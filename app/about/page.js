"use client";
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-[#fcfcfd] min-h-screen font-sans">
      
      {/* 1. CINEMATIC HERO SECTION - 🟢 FIXED TOP SPACING */}
      <section className="relative bg-[#07080b] border-b-[3px] sm:border-b-[4px] border-red-600 flex items-center min-h-[50vh] sm:min-h-[70vh] overflow-hidden pt-6 sm:pt-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] sm:w-[800px] sm:h-[800px] bg-red-600/15 blur-[60px] sm:blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 z-0"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center text-center py-6 sm:py-20">
          <h4 className="text-red-500 font-bold tracking-[0.15em] sm:tracking-[0.3em] uppercase mb-2 sm:mb-4 text-[10px] sm:text-sm flex items-center justify-center gap-1.5 sm:gap-3">
            <span className="w-6 sm:w-10 h-[2px] bg-red-600"></span> 
            Company Profile 
            <span className="w-6 sm:w-10 h-[2px] bg-red-600"></span>
          </h4>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-3 sm:mb-6 tracking-tight leading-[1.15] sm:leading-[1.1] uppercase">
            Powering The <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">Modern World.</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-lg max-w-sm sm:max-w-3xl mx-auto font-medium leading-relaxed px-1 sm:px-2">
            Welcome to Shajjad Electronics, the driving force behind the premium electrical brand FLOREY. We merge cutting-edge engineering with timeless design.
          </p>
        </div>
      </section>

      {/* 2. AUTHENTIC HIGHLIGHTS (Perfect Mobile 2x2 Grid) */}
      <section className="bg-white border-b border-gray-100 relative z-20 shadow-[0_10px_40px_rgba(0,0,0,0.03)] -mt-8 sm:-mt-10 mx-4 sm:mx-8 lg:mx-auto max-w-6xl rounded-2xl sm:rounded-3xl">
        <div className="grid grid-cols-2 md:grid-cols-4 text-center">
          <div className="p-4 sm:p-10 border-b border-r border-gray-100 md:border-b-0 flex flex-col items-center justify-center">
            <p className="text-xl sm:text-4xl font-black text-gray-900 mb-0.5 sm:mb-1">100%</p>
            <p className="text-[9px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] sm:tracking-[0.2em]">Quality Tested</p>
          </div>
          <div className="p-4 sm:p-10 border-b border-gray-100 md:border-b-0 md:border-r flex flex-col items-center justify-center">
            <p className="text-lg sm:text-3xl font-black text-gray-900 mb-0.5 sm:mb-1">PAN INDIA</p>
            <p className="text-[9px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] sm:tracking-[0.2em]">Delivery Network</p>
          </div>
          <div className="p-4 sm:p-10 border-r border-gray-100 md:border-b-0 md:border-r flex flex-col items-center justify-center">
            <p className="text-lg sm:text-3xl font-black text-gray-900 mb-0.5 sm:mb-1">PREMIUM</p>
            <p className="text-[9px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] sm:tracking-[0.2em]">Polycarbonate Build</p>
          </div>
          <div className="p-4 sm:p-10 flex flex-col items-center justify-center">
            <p className="text-lg sm:text-3xl font-black text-red-600 mb-0.5 sm:mb-1">END-TO-END</p>
            <p className="text-[9px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] sm:tracking-[0.2em]">Electrical Solutions</p>
          </div>
        </div>
      </section>

      {/* 3. THE BRAND STORY */}
      <section className="py-12 sm:py-28 bg-[#fcfcfd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-center">
            
            <div className="w-full lg:w-1/2 order-2 lg:order-1 space-y-3 sm:space-y-6">
              <h4 className="text-red-600 font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[10px] sm:text-xs">About Shajjad Electronics</h4>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                Engineering Trust, <br className="hidden sm:block"/> Delivering <span className="text-red-600">Excellence</span>.
              </h2>
              <div className="w-12 sm:w-16 h-1 sm:h-1.5 bg-gray-900 rounded-full"></div>
              
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600 font-medium pt-2 sm:pt-4">
                <p>
                  Shajjad Electronics was established with a singular vision: to bring uncompromised safety, durability, and world-class quality to the Indian electrical market. We believe that electrical accessories are the silent strength behind every home and business.
                </p>
                <p>
                  Observing the shifting trends in modern architecture, we realized that switches and sockets needed an evolution. They are no longer just functional utilities; they are integral elements of interior design. This realization birthed our premium brand, <strong className="text-gray-900">FLOREY</strong>.
                </p>
                <p>
                  Today, FLOREY stands as a symbol of aesthetic brilliance and industrial-grade safety. Every product that rolls out of our facility is a testament to our commitment to excellence.
                </p>
              </div>
            </div>

            <div className="w-full lg:w-1/2 order-1 lg:order-2 mt-4 sm:mt-0">
              <div className="relative h-[250px] sm:h-[400px] lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border border-gray-100 group">
                <Image 
                  src="/images/category-modular.png" 
                  alt="Florey Manufacturing Excellence" 
                  fill 
                  className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-10 sm:left-10">
                  <p className="text-white font-bold text-sm sm:text-xl leading-snug">"Excellence is never an accident; it is the result of high intention."</p>
                  <p className="text-red-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] mt-1.5 sm:mt-3">— Management, Shajjad Electronics</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. VISION & MISSION (Dark Premium Block) */}
      <section className="bg-[#07080b] text-white py-12 sm:py-28 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-20">
            
            <div className="bg-[#12141a] p-6 sm:p-14 rounded-2xl sm:rounded-[2.5rem] border border-gray-800 hover:border-red-600/50 transition-colors">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600/10 text-red-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-8">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black mb-2 sm:mb-4 uppercase">Our Vision</h3>
              <p className="text-gray-400 text-xs sm:text-lg leading-relaxed">
                To be the most trusted and preferred electrical brand in India, recognized for setting high standards in safety, innovative design, and sustainable manufacturing practices. We envision a future where every modern space is powered securely and beautifully by FLOREY.
              </p>
            </div>

            <div className="bg-[#12141a] p-6 sm:p-14 rounded-2xl sm:rounded-[2.5rem] border border-gray-800 hover:border-red-600/50 transition-colors mt-4 lg:mt-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600/10 text-red-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-8">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black mb-2 sm:mb-4 uppercase">Our Mission</h3>
              <p className="text-gray-400 text-xs sm:text-lg leading-relaxed">
                To engineer electrical accessories using the finest grade virgin polycarbonate and cutting-edge mechanisms. We strive to provide zero-defect products, ensure maximum profitability for our distribution partners, and deliver unmatched value to the end consumer.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. PRODUCT PORTFOLIO OVERVIEW (Mobile 2-Column Optimized) */}
      <section className="py-12 sm:py-28 bg-[#f8f9fa] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h4 className="text-red-600 font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-1.5 sm:mb-3 text-[10px] sm:text-xs">What We Build</h4>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 uppercase">Our Core Segments</h2>
            <div className="w-12 sm:w-16 h-1 bg-red-600 rounded-full mt-3 sm:mt-5 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-white p-4 sm:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all text-center flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16m-7 6h7" /></svg>
              </div>
              <h3 className="font-bold text-gray-900 text-[11px] sm:text-base mb-1 sm:mb-2 leading-tight">Modular Switches</h3>
              <p className="text-gray-500 text-[9px] sm:text-sm hidden sm:block">Silent operation, spark-free mechanisms, and aesthetic designs.</p>
            </div>
            <div className="bg-white p-4 sm:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all text-center flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="font-bold text-gray-900 text-[11px] sm:text-base mb-1 sm:mb-2 leading-tight">Circuit Protection</h3>
              <p className="text-gray-500 text-[9px] sm:text-sm hidden sm:block">High-grade MCBs and distribution boards for absolute safety.</p>
            </div>
            <div className="bg-white p-4 sm:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all text-center flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="font-bold text-gray-900 text-[11px] sm:text-base mb-1 sm:mb-2 leading-tight">Accessories</h3>
              <p className="text-gray-500 text-[9px] sm:text-sm hidden sm:block">Heavy-duty plugs, sockets, and fan regulators engineered for long life.</p>
            </div>
            <div className="bg-white p-4 sm:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all text-center flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <h3 className="font-bold text-gray-900 text-[11px] sm:text-base mb-1 sm:mb-2 leading-tight">Smart Lighting</h3>
              <p className="text-gray-500 text-[9px] sm:text-sm hidden sm:block">Energy-efficient LED panels and contemporary lighting solutions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MANUFACTURING EXCELLENCE */}
      <section className="py-12 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h4 className="text-red-600 font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-1.5 sm:mb-3 text-[10px] sm:text-xs">Uncompromising Quality</h4>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 uppercase">Manufacturing Excellence</h2>
            <div className="w-12 sm:w-16 h-1 bg-red-600 rounded-full mt-3 sm:mt-5 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-10">
            <div className="p-6 sm:p-8 bg-[#f8f9fa] rounded-xl sm:rounded-2xl border border-gray-100 flex gap-4 sm:block items-start">
              <div className="w-12 h-12 sm:w-12 sm:h-12 shrink-0 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 sm:mb-5 text-gray-900">
                <svg className="w-5 h-5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">Premium Materials</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  We strictly use Fire Retardant Virgin Polycarbonate. This ensures our switches never turn yellow, resist high impacts, and prevent the spread of fire.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-[#f8f9fa] rounded-xl sm:rounded-2xl border border-gray-100 flex gap-4 sm:block items-start">
              <div className="w-12 h-12 sm:w-12 sm:h-12 shrink-0 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 sm:mb-5 text-gray-900">
                <svg className="w-5 h-5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">Stringent Testing</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  Every component passes through rigorous quality control. Our switches are tested to guarantee lifelong, spark-free performance.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-[#f8f9fa] rounded-xl sm:rounded-2xl border border-gray-100 flex gap-4 sm:block items-start">
              <div className="w-12 h-12 sm:w-12 sm:h-12 shrink-0 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 sm:mb-5 text-gray-900">
                <svg className="w-5 h-5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">Advanced R&D</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  Our Research & Development team continuously studies interior design trends and electrical safety protocols to engineer technologically superior accessories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHY PARTNER WITH US */}
      <section className="py-12 sm:py-24 bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-center">
            
            <div className="w-full lg:w-1/3 text-center sm:text-left">
              <h4 className="text-red-500 font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-2 sm:mb-3 text-[10px] sm:text-xs">B2B Network</h4>
              <h2 className="text-3xl sm:text-4xl font-black uppercase leading-tight mb-4 sm:mb-6">Why Partner <br className="hidden sm:block"/>With Florey?</h2>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 max-w-sm mx-auto sm:mx-0">
                We believe in growing together. Becoming a FLOREY distributor means partnering with a brand that values transparency and mutual profitability.
              </p>
              <Link href="/distributorship" className="inline-flex bg-red-600 text-white font-bold px-6 sm:px-6 py-3 sm:py-3 rounded-full hover:bg-red-700 transition-all text-xs sm:text-sm items-center justify-center w-full sm:w-auto gap-2">
                Apply for Distributorship <svg className="w-4 h-4 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>

            <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mt-6 sm:mt-0">
              <div className="bg-[#111111] border border-gray-800 p-5 sm:p-6 rounded-xl sm:rounded-2xl flex items-center gap-4">
                <div className="w-2.5 h-2.5 sm:w-2 sm:h-2 bg-red-600 rounded-full shrink-0"></div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold mb-1 sm:mb-1 text-white">Lucrative Margins</h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">Highly competitive pricing structures for excellent ROI.</p>
                </div>
              </div>
              <div className="bg-[#111111] border border-gray-800 p-5 sm:p-6 rounded-xl sm:rounded-2xl flex items-center gap-4">
                <div className="w-2.5 h-2.5 sm:w-2 sm:h-2 bg-red-600 rounded-full shrink-0"></div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold mb-1 sm:mb-1 text-white">Marketing Support</h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">Complete offline and online branding and promotional support.</p>
                </div>
              </div>
              <div className="bg-[#111111] border border-gray-800 p-5 sm:p-6 rounded-xl sm:rounded-2xl flex items-center gap-4">
                <div className="w-2.5 h-2.5 sm:w-2 sm:h-2 bg-red-600 rounded-full shrink-0"></div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold mb-1 sm:mb-1 text-white">Consistent Supply</h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">Robust inventory management and pan-India logistics.</p>
                </div>
              </div>
              <div className="bg-[#111111] border border-gray-800 p-5 sm:p-6 rounded-xl sm:rounded-2xl flex items-center gap-4">
                <div className="w-2.5 h-2.5 sm:w-2 sm:h-2 bg-red-600 rounded-full shrink-0"></div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold mb-1 sm:mb-1 text-white">Monopoly Rights</h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">Area-specific distribution rights to secure your market.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. CORE VALUES (Mobile 2-Column Grid) */}
      <section className="py-12 sm:py-24 bg-[#111111] text-white border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-16 text-center">
            <h4 className="text-red-500 font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-2 sm:mb-3 text-[10px] sm:text-xs">What We Stand For</h4>
            <h2 className="text-2xl sm:text-4xl font-black uppercase">Core Values</h2>
            <div className="w-12 sm:w-16 h-1 bg-red-600 rounded-full mt-3 sm:mt-4 mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-[#1a1a1a] border border-gray-800 p-4 sm:p-8 rounded-xl sm:rounded-2xl flex flex-col justify-center text-center">
              <h3 className="text-xs sm:text-lg font-bold mb-1.5 sm:mb-3 text-red-500">01. Safety First</h3>
              <p className="text-gray-400 text-[10px] sm:text-sm leading-relaxed">No compromises when it comes to the safety of homes and human lives.</p>
            </div>
            <div className="bg-[#1a1a1a] border border-gray-800 p-4 sm:p-8 rounded-xl sm:rounded-2xl flex flex-col justify-center text-center">
              <h3 className="text-xs sm:text-lg font-bold mb-1.5 sm:mb-3 text-red-500">02. Design Priority</h3>
              <p className="text-gray-400 text-[10px] sm:text-sm leading-relaxed">Crafting minimalist accessories that blend seamlessly with high-end interiors.</p>
            </div>
            <div className="bg-[#1a1a1a] border border-gray-800 p-4 sm:p-8 rounded-xl sm:rounded-2xl flex flex-col justify-center text-center">
              <h3 className="text-xs sm:text-lg font-bold mb-1.5 sm:mb-3 text-red-500">03. Durability</h3>
              <p className="text-gray-400 text-[10px] sm:text-sm leading-relaxed">Engineered to withstand fluctuations, heavy usage, and the test of time.</p>
            </div>
            <div className="bg-[#1a1a1a] border border-gray-800 p-4 sm:p-8 rounded-xl sm:rounded-2xl flex flex-col justify-center text-center">
              <h3 className="text-xs sm:text-lg font-bold mb-1.5 sm:mb-3 text-red-500">04. Ethics</h3>
              <p className="text-gray-400 text-[10px] sm:text-sm leading-relaxed">Maintaining absolute transparency with our distributors, dealers, and consumers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. BOTTOM CTA */}
      <section className="bg-white py-12 sm:py-24 text-center border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-2 sm:mb-4 uppercase tracking-tight">Become a part of our journey</h2>
          <p className="text-gray-500 text-xs sm:text-lg mb-6 sm:mb-10 max-w-xl mx-auto font-medium">
            Whether you want to upgrade your home with FLOREY products or partner with us as a distributor, we are just a message away.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/products" className="w-full sm:w-auto bg-gray-900 text-white font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl shadow-lg hover:bg-black transition-all text-xs sm:text-sm flex items-center justify-center gap-2">
              Explore Catalogue &rarr;
            </Link>
            <Link href="/distributorship" className="w-full sm:w-auto bg-white text-gray-900 font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl border border-gray-200 hover:border-red-600 hover:text-red-600 transition-all text-xs sm:text-sm flex items-center justify-center gap-2">
              Partner With Us &rarr;
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}