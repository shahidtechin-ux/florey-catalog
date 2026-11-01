"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';

const sliderImages = [
  "/images/hero1.png",  
  "/images/slideim2.png", 
  "/images/slideim3.png", 
  "/images/slideim4.png"  
];

// Note: Agar aap seedha fetch aur force-download use kar rahe hain toh is getDownloadUrl ki ab aisi zarurat nahi hai, 
// par baaki jagah code na tute isliye isko chhod diya hai.
const getDownloadUrl = (url) => {
  if (!url) return '#';
  return url.replace('/upload/', '/upload/fl_attachment/');
};

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Maintenance Mode & Catalogue States
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [catalogue, setCatalogue] = useState({ pdfUrl: '', coverImage: '', edition: '2026-27', title: '' });

  // Loading states for View & Download buttons
  const [isViewing, setIsViewing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  // Parallel data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [setRes, prodRes, catRes] = await Promise.all([
          fetch('/api/settings').catch(() => null),
          fetch('/api/products').catch(() => null),
          fetch('/api/catalogue').catch(() => null)
        ]);

        if (setRes) {
          const setData = await setRes.json();
          if (setData.success && setData.data) {
            setIsMaintenance(setData.data.maintenanceMode);
          }
        }

        if (prodRes) {
          const prodData = await prodRes.json();
          if (prodData.success) {
            setFeaturedProducts(prodData.data.filter(product => product.isFeatured));
          }
        }

        if (catRes) {
          const catData = await catRes.json();
          if (catData.success && catData.data) {
            setCatalogue(catData.data);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
    setTouchStart(0);
    setTouchEnd(0);
  };

  // 1. Ultra Smooth View Function (Custom Title)
  const handleViewCatalogue = () => {
    setIsViewing(true);
    try {
      const pdfLink = catalogue?.fileUrl || catalogue?.pdfUrl;
      
      if (pdfLink) {
        const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfLink)}&embedded=true`;
        const newWindow = window.open('', '_blank');
        
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
        alert("Catalogue abhi available nahi hai.");
      }
    } catch (error) {
      console.error("View error:", error);
    } finally {
      setIsViewing(false);
    }
  };

  // 2. Download Function (Custom 'FLOREY_Catalogue.pdf' Name)
  const handleDownloadCatalogue = async () => {
    setIsDownloading(true);
    try {
      const pdfLink = catalogue?.fileUrl || catalogue?.pdfUrl;

      if (pdfLink) {
        // Blob fetch for forcing download with custom name
        const response = await fetch(pdfLink);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'FLOREY_Catalogue.pdf';
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Catalogue abhi available nahi hai.");
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Download fail ho gaya, kripya apna internet connection check karein.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <svg className="animate-spin h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>
    );
  }

  if (isMaintenance) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Website Under Maintenance</h1>
        <p className="text-lg text-gray-400 max-w-md mx-auto mb-8">
          We are currently updating our website to bring you a better experience. Please check back later.
        </p>
        <p className="text-sm text-gray-500 font-mono">FLOREY Electricals Team</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 pb-0 font-sans">
      
      {/* 1. Image Slider Section */}
      <section 
        className="relative w-full aspect-[16/9] md:aspect-video bg-gray-900 overflow-hidden border-b-[4px] border-red-600 group flex items-center justify-center touch-pan-y select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {sliderImages.map((img, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image 
              src={img} 
              alt={`FLOREY Slider Image ${index + 1}`} 
              fill 
              className="object-cover object-center w-full h-full pointer-events-none" 
              priority={index === 0} 
              draggable={false}
            />
          </div>
        ))}

        <button onClick={prevSlide} className="hidden sm:block absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-red-600 text-white p-2 sm:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 shadow-lg cursor-pointer">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
        </button>

        <button onClick={nextSlide} className="hidden sm:block absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-red-600 text-white p-2 sm:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 shadow-lg cursor-pointer">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
        </button>
        
        <div className="absolute bottom-[10%] sm:bottom-[15%] left-[5%] flex flex-row gap-2 sm:gap-4 z-30 w-auto whitespace-nowrap">
          <Link href="/products">
            <button className="bg-white text-gray-900 font-bold sm:font-extrabold px-3.5 py-1.5 sm:px-8 sm:py-3.5 rounded-full shadow-xl hover:bg-gray-200 hover:scale-105 transition-all duration-300 text-[11px] sm:text-base md:text-lg border border-gray-200">
              View Products
            </button>
          </Link>
          <Link href="/distributorship">
            <button className="bg-red-600 text-white font-bold sm:font-extrabold px-3.5 py-1.5 sm:px-8 sm:py-3.5 rounded-full shadow-xl hover:bg-red-700 hover:scale-105 transition-all duration-300 text-[11px] sm:text-base md:text-lg border border-red-600 sm:border-2">
              Become a Distributor
            </button>
          </Link>
        </div>

        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-30 bg-white/30 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full backdrop-blur-sm">
          {sliderImages.map((_, index) => (
            <button key={index} onClick={() => setCurrentIndex(index)} className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${index === currentIndex ? "bg-red-600 w-4 sm:w-8" : "bg-gray-400 w-1.5 sm:w-2 hover:bg-gray-600"}`}></button>
          ))}
        </div>
      </section>

      {/* 2. Product Categories */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-wide uppercase">Our Product Range</h2>
          <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-red-600 mx-auto mt-3 sm:mt-4 rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <CategoryCard title="Modular Switches" image="/images/cat-modular.png" />
          <CategoryCard title="Sockets & Accessories" image="/images/cat-sockets.png" />
          <CategoryCard title="Dimmers & Regulators" image="/images/cat-dimmers.png" />
          <CategoryCard title="MCBs & Protection" image="/images/cat-mcb.png" />
          <CategoryCard title="LED Lighting" image="/images/cat-led.png" />
          <CategoryCard title="Electrical Accessories" image="/images/cat-accessories.png" />
          <CategoryCard title="Wires & Cables" image="/images/cat-wires.png" />
          <CategoryCard title="PC/GEM/CRYSTAL Series" image="/images/cat-series.png" />
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="py-12 sm:py-16 bg-gray-100 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-10 sm:mb-12 gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-wide uppercase">Featured Collection</h2>
              <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-red-600 mt-3 sm:mt-4 rounded-full mx-auto sm:mx-0"></div>
            </div>
            <Link href="/products" className="text-red-600 font-bold hover:text-red-700 transition-colors text-sm sm:text-base">
              View All &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
            {featuredProducts.length > 0 ? (
               featuredProducts.slice(0, 6).map((product) => (
                 <FeaturedCard 
                    key={product._id} 
                    id={product._id}
                    title={product.name} 
                    desc={`${product.series} Series`} 
                    image={product.image || (product.images && product.images[0])} 
                 />
               ))
            ) : (
               <div className="col-span-full text-center text-gray-500 py-10">
                 No featured products yet. Please mark products as "Featured" from the Admin Panel.
               </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Why Choose Florey */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-wide uppercase">Why Choose Us</h2>
          <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-red-600 mx-auto mt-3 sm:mt-4 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <WhyCard title="Premium Design" desc="Modern electrical products designed for contemporary and luxury spaces." />
          <WhyCard title="Wide Product Range" desc="Switches, sockets, accessories, MCBs, LED lighting, wires and more." />
          <WhyCard title="Quality Focused" desc="Built around quality, safety, and highly reliable electrical solutions." />
          <WhyCard title="Business Partnership" desc="Lucrative distributor opportunities for dedicated business partners." />
        </div>
      </section>

      {/* 5. PRODUCT EXPERIENCE */}
      <section className="bg-[#111111] text-white py-16 sm:py-24 border-y border-red-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left z-10">
              <h4 className="text-red-500 font-bold tracking-[0.2em] uppercase mb-4 text-xs sm:text-sm">Product Experience</h4>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                DESIGNED FOR <br/> <span className="text-gray-300">MODERN SPACES</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-lg mx-auto md:mx-0 mb-8">
                From switches and sockets to lighting and electrical protection, discover solutions designed perfectly for modern, luxury, and contemporary spaces.
              </p>
              <div>
                <Link href="/products">
                  <button className="bg-transparent text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:bg-red-600 hover:border-red-600 transition-all duration-300 text-sm sm:text-base border border-gray-500 hover:scale-105">
                    Explore Solutions
                  </button>
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/2 relative aspect-video rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
              <Image src="/images/experience.png" alt="Luxury Modern Room with Florey Products" fill className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out" />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. UPGRADED CATALOGUE SECTION (Download Hub) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-3xl p-8 sm:p-16 border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] flex flex-col lg:flex-row items-center gap-12">
            
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h4 className="text-red-600 font-bold tracking-[0.2em] uppercase mb-3 text-sm">Download Hub</h4>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-6">{catalogue?.title || "Explore Our Complete Catalogue"}</h2>
              <p className="text-base sm:text-lg text-gray-500 mb-10 max-w-lg mx-auto lg:mx-0">
                Discover the complete range of Florey electrical products. Explore our detailed guide featuring modular switches, MCBs, LED lighting, and more.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                
                <button 
                  onClick={handleViewCatalogue}
                  disabled={isViewing || (!catalogue?.fileUrl && !catalogue?.pdfUrl)}
                  className="bg-gray-900 text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:bg-black hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto text-sm sm:text-base border border-gray-900 disabled:opacity-50"
                >
                  {isViewing ? "Loading..." : "View Catalogue"}
                </button>
                
                <button 
                  onClick={handleDownloadCatalogue}
                  disabled={isDownloading || (!catalogue?.fileUrl && !catalogue?.pdfUrl)}
                  className="bg-red-600 text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:bg-red-700 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto text-sm sm:text-base border border-red-600 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDownloading ? (
                    "Downloading..."
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      Download PDF
                    </>
                  )}
                </button>

              </div>
            </div>

            <div className="w-full lg:w-1/2 flex justify-center perspective-[1000px]">
              <div className="relative w-64 sm:w-80 aspect-[1/1.4] transform rotate-y-[-15deg] rotate-x-[5deg] group hover:rotate-y-0 transition-transform duration-700 shadow-2xl rounded-lg">
                <div className="absolute top-2 left-2 w-full h-full bg-gray-200 rounded-lg shadow-xl border border-gray-300"></div>
                <div className="absolute top-4 left-4 w-full h-full bg-gray-100 rounded-lg shadow-xl border border-gray-300"></div>
                
                <div className="absolute inset-0 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
                  <Image 
                    src={catalogue?.coverImage || "/images/catalogue-cover.png"} 
                    alt={`Florey Product Catalogue ${catalogue?.edition || '2026-27'}`} 
                    fill 
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. POWERFUL DISTRIBUTOR SECTION */}
      <section className="bg-gray-900 py-16 sm:py-24 border-t-4 border-red-600 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-red-600/10 blur-3xl rounded-full transform rotate-45 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            <div className="w-full lg:w-1/2 text-white">
              <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 leading-tight">Become a <span className="text-red-500">Florey</span> Distributor</h2>
              <p className="text-gray-400 text-lg mb-8 max-w-lg">
                Grow your business with a premium brand and a wide range of highly reliable, beautifully designed electrical products.
              </p>
              
              <h4 className="text-xl font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Why partner with us?</h4>
              <ul className="space-y-4">
                {[
                  "Wide premium product portfolio",
                  "Multiple product categories (Switches, MCB, Wire)",
                  "Dedicated business enquiry support",
                  "Full product catalogue access & marketing material"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-gray-300">
                    <div className="w-6 h-6 rounded-full bg-red-600/20 flex items-center justify-center flex-shrink-0 text-red-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    </div>
                    <span className="text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden text-center sm:text-left">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-10"></div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">Start Your Distributor Application</h3>
                <p className="text-gray-500 mb-8 text-sm sm:text-base">
                  Join our growing network of business partners and take your electrical business to the next level with Florey.
                </p>
                <Link href="/distributorship">
                  <button className="w-full bg-red-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-red-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group text-lg">
                    Apply Now 
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. HOW IT WORKS */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h4 className="text-red-600 font-bold tracking-[0.2em] uppercase mb-3 text-sm">Process</h4>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-16">Become a Distributor in <span className="text-red-600">3 Simple Steps</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[15%] w-[70%] h-[2px] bg-red-200 border-t-2 border-dashed border-red-300"></div>

            <div className="relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl font-black mb-6 relative z-10 shadow-sm border-4 border-white">01</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Submit Enquiry</h3>
              <p className="text-gray-500 text-sm">Fill out the quick and easy distributor form on our website.</p>
            </div>
            
            <div className="relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl font-black mb-6 relative z-10 shadow-sm border-4 border-white">02</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Team Connects</h3>
              <p className="text-gray-500 text-sm">Our business team reviews your enquiry and connects with you.</p>
            </div>

            <div className="relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-black mb-6 relative z-10 shadow-sm border-4 border-white">03</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Start Partnership</h3>
              <p className="text-gray-500 text-sm">Discuss products, finalize the distributorship, and start growing!</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. PRE-FOOTER PREMIUM CTA (Black Background) */}
      <section className="bg-gray-900 py-16 relative overflow-hidden border-t border-gray-800">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(#fff 2px, transparent 2px)", backgroundSize: "30px 30px" }}></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">Let's Build a Better Electrical Future</h2>
          <p className="text-gray-400 text-lg mb-10">
            Have a product enquiry, need support, or want to become a regional distributor? We are just a message away.
          </p>
          
          {/* 🟢 Buttons Section (Mobile Optimized: Side by Side) */}
          <div className="flex flex-row items-center justify-center gap-3 w-full sm:w-auto max-w-md mx-auto sm:max-w-none">
            
            {/* Contact Us Button */}
            <Link href="/contact" className="flex-1 sm:flex-none">
              <button className="w-full bg-white text-gray-900 py-3.5 px-2 sm:px-10 rounded-xl sm:rounded-full text-sm sm:text-base font-extrabold text-center transition-all hover:bg-gray-200 hover:-translate-y-1 shadow-xl border border-transparent">
                Contact Us
              </button>
            </Link>

            {/* WhatsApp Us Button */}
            <Link href="https://wa.me/917065555127" target="_blank" className="flex-1 sm:flex-none">
              <button className="w-full bg-green-500 text-white py-3.5 px-2 sm:px-10 rounded-xl sm:rounded-full text-sm sm:text-base font-extrabold flex items-center justify-center gap-1.5 transition-all hover:bg-green-600 hover:-translate-y-1 shadow-xl border border-transparent">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </button>
            </Link>
            
          </div>
        </div>
      </section>

    </div>
  );
}

// Category Card
function CategoryCard({ title, image }) {
  return (
    <Link href={`/products?category=${encodeURIComponent(title)}`} className="group cursor-pointer flex flex-col items-center">
      <div className="w-full aspect-[4/5] bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center mb-3 sm:mb-4 group-hover:shadow-[0_15px_30px_rgba(220,38,38,0.1)] group-hover:border-red-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 transition-all duration-300 overflow-hidden relative p-2 sm:p-5">
        <div className="relative w-full h-full flex items-center justify-center">
           {/* eslint-disable-next-line @next/next/no-img-element */}
           <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-sm" 
              onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=No+Image' }} 
           />
        </div>
      </div>
      <h3 className="font-bold text-gray-800 text-center text-xs sm:text-base group-hover:text-red-600 transition-colors">{title}</h3>
    </Link>
  );
}

// Featured Card
function FeaturedCard({ id, title, desc, image }) {
  return (
    <Link href={`/products/${id}`} className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group cursor-pointer">
      <div className="w-full aspect-square bg-gray-50 rounded-lg sm:rounded-xl mb-3 sm:mb-4 flex items-center justify-center overflow-hidden border border-gray-100 relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={image || 'https://via.placeholder.com/200?text=No+Image'} 
          alt={title} 
          className="object-contain w-full h-full p-2 group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=Error' }}
        />
      </div>
      <h4 className="font-bold text-gray-900 text-xs sm:text-sm mb-1 line-clamp-1 w-full">{title}</h4>
      <p className="text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">{desc}</p>
      <button className="text-red-600 font-bold text-[10px] sm:text-xs border border-red-600 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full group-hover:bg-red-600 group-hover:text-white transition-colors w-full">
        View
      </button>
    </Link>
  );
}

// Why Card
function WhyCard({ title, desc }) {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-md border-t-4 border-red-600 hover:shadow-xl transition-shadow text-center sm:text-left">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">{desc}</p>
     </div>
  );
}