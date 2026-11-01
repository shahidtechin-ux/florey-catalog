"use client";
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

// FIX 1: Admin Panel se match karti hui exact categories
const categoriesList = [
  "ALL",
  "Modular Switches",
  "Sockets & Accessories",
  "Dimmers & Regulators",
  "MCBs & Protection",
  "LED Lighting",
  "Electrical Accessories",
  "Wires & Cables",
  "PC/GEM/CRYSTAL Series"
];

const getDownloadUrl = (url) => {
  if (!url) return '#';
  return url.replace('/upload/', '/upload/fl_attachment/');
};

// ASLI CONTENT COMPONENT (Isme URL read karne ka logic hai)
function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryQuery = searchParams.get('category'); 

  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedSeries, setSelectedSeries] = useState([]);
  const [isFeaturedOnly, setIsFeaturedOnly] = useState(false);
  const [sortOption, setSortOption] = useState("Featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [catalogue, setCatalogue] = useState({ pdfUrl: '', coverImage: '', edition: '2026-27', title: '' });

  // Loading states for View & Download buttons
  const [isViewing, setIsViewing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // JAISE HI PAGE LOAD HOGA, YE URL WALI CATEGORY SET KAR DEGA
  useEffect(() => {
    if (categoryQuery && categoriesList.includes(categoryQuery)) {
      setActiveCategory(categoryQuery);
    }
  }, [categoryQuery]);

  // Database se products aur catalogue lana
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        }

        const catRes = await fetch('/api/catalogue');
        const catData = await catRes.json();
        if (catData.success && catData.data) {
           setCatalogue(catData.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSeries = (seriesName) => {
    setSelectedSeries(prev => 
      prev.includes(seriesName) 
        ? prev.filter(s => s !== seriesName) 
        : [...prev, seriesName]
    );
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

  // Asli Filtering Logic
  let filteredProducts = products.filter(product => {
    const matchCategory = activeCategory === "ALL" || product.category === activeCategory;
    const matchSeries = selectedSeries.length === 0 || selectedSeries.includes(product.series);
    const matchFeatured = !isFeaturedOnly || product.isFeatured === true;
    return matchCategory && matchSeries && matchFeatured;
  });

  // Asli Sorting Logic
  if (sortOption === "A - Z") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === "Z - A") {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortOption === "Price: Low to High") {
    filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortOption === "Price: High to Low") {
    filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else {
    filteredProducts.sort((a, b) => (b.isFeatured === true) - (a.isFeatured === true));
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans pb-10">
      
      {/* 1. CINEMATIC PREMIUM HERO */}
      <section className="relative bg-[#0a0a0a] border-b-[4px] border-red-600 flex items-center min-h-[420px] md:min-h-[500px] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 z-0"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-12 py-16">
          <div className="md:w-1/2 text-center md:text-left">
            <h4 className="text-red-500 font-bold tracking-[0.2em] uppercase mb-4 text-xs sm:text-sm flex items-center justify-center md:justify-start gap-2">
              <span className="w-8 h-[2px] bg-red-600"></span> Premium Electrical Solutions
            </h4>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
              Designed for <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">Modern Spaces.</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-lg font-medium mx-auto md:mx-0">
              Explore FLOREY's complete range of electrical products engineered for contemporary residential and commercial spaces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href="#catalogue" className="bg-red-600 text-white font-bold px-8 py-4 rounded-full shadow-[0_4px_15px_rgba(220,38,38,0.4)] hover:bg-red-700 hover:-translate-y-1 transition-all text-center">
                Explore Products &rarr;
              </a>
              <Link href="#download" className="bg-transparent border border-gray-600 text-white font-bold px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all text-center">
                View Catalogue
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center md:justify-end relative">
             <div className="w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] bg-gradient-to-br from-gray-800 to-black border border-gray-700 rounded-full flex items-center justify-center shadow-2xl relative">
                <div className="absolute inset-0 bg-red-600/20 rounded-full blur-2xl"></div>
                <div className="relative w-[80%] h-[80%] z-10 hover:scale-110 transition-transform duration-700">
                  <Image src="/images/hero-switch.png" alt="Premium Florey Switch" fill className="object-contain drop-shadow-2xl" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 2. EXPLORE CATEGORIES */}
      <section id="catalogue" className="bg-[#f8f9fa] pt-12 sm:pt-20 pb-4 sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-wide mb-4 sm:mb-6">Explore Categories</h2>
          <div className="flex overflow-x-auto pb-4 gap-2 sm:gap-3 hide-scrollbar items-center">
            {categoriesList.map((cat, idx) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-[10px] sm:text-xs font-bold tracking-widest transition-all uppercase flex items-center gap-1.5 sm:gap-2 ${
                  activeCategory === cat 
                    ? 'bg-red-600 text-white shadow-[0_4px_15px_rgba(220,38,38,0.3)]' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600 shadow-sm'
                }`}
              >
                {cat !== "ALL" && <span className="opacity-50 text-[9px] sm:text-[10px] hidden sm:inline-block">{(idx).toString().padStart(2, '0')}</span>} 
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MAIN CATALOGUE & FILTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">
        
        {/* MOBILE FILTER BUTTON */}
        <div className="lg:hidden flex items-center justify-between mb-4 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
           <button 
             onClick={() => setShowMobileFilters(!showMobileFilters)}
             className="flex items-center gap-2 text-sm font-bold text-gray-800"
           >
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Filter & Sort
           </button>
           <p className="text-xs font-bold text-gray-500">{filteredProducts.length} Items</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          
          {/* SIDEBAR FILTERS (Responsive) */}
          <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 shrink-0`}>
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 lg:sticky lg:top-40">
              
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                 <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Filter By</h3>
                 {showMobileFilters && (
                    <button onClick={() => setShowMobileFilters(false)} className="text-gray-400 hover:text-red-600 lg:hidden">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                 )}
              </div>
              
              {/* Mobile Sort Dropdown */}
              <div className="mb-8 lg:hidden">
                 <h4 className="font-bold text-gray-500 text-xs uppercase mb-3">Sort Results</h4>
                 <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl text-sm font-bold focus:outline-none focus:border-red-600">
                    <option value="Featured">Featured First</option>
                    <option value="A - Z">Alphabetical (A-Z)</option>
                    <option value="Z - A">Alphabetical (Z-A)</option>
                    <option value="Price: Low to High">Price: Low to High</option>
                    <option value="Price: High to Low">Price: High to Low</option>
                 </select>
              </div>

              {/* Series Filter */}
              <div className="mb-8">
                <h4 className="font-bold text-gray-500 text-xs uppercase mb-3">Product Series</h4>
                <div className="space-y-3">
                  {['Standard', 'Gold', 'PC', 'Crystal'].map(series => (
                    <label key={series} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                         type="checkbox" 
                         checked={selectedSeries.includes(series)}
                         onChange={() => toggleSeries(series)}
                         className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-600 cursor-pointer" 
                      />
                      <span className={`text-sm font-medium transition-colors ${selectedSeries.includes(series) ? 'text-red-600 font-bold' : 'text-gray-700 group-hover:text-red-600'}`}>{series} Series</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div>
                <h4 className="font-bold text-gray-500 text-xs uppercase mb-3">Availability</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                     <input 
                        type="checkbox" 
                        checked={isFeaturedOnly}
                        onChange={() => setIsFeaturedOnly(!isFeaturedOnly)}
                        className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-600 cursor-pointer" 
                     />
                     <span className={`text-sm font-medium transition-colors ${isFeaturedOnly ? 'text-red-600 font-bold' : 'text-gray-700 group-hover:text-red-600'}`}>Featured Only</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                     <input type="checkbox" defaultChecked className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-600 cursor-pointer" />
                     <span className="text-sm font-bold text-red-600">In Stock</span>
                  </label>
                </div>
              </div>

            </div>
          </div>

          {/* PRODUCT GRID AREA */}
          <div className="flex-grow">
            
            {/* Desktop Sort & Count */}
            <div className="hidden lg:flex justify-between items-center mb-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-sm font-bold text-gray-500">
                <span className="text-gray-900 font-black text-lg mr-1">{filteredProducts.length}</span> Products Found
              </p>
              <div className="flex items-center gap-2">
                 <span className="text-xs font-bold text-gray-400 uppercase">Sort By:</span>
                 <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-600/20 cursor-pointer">
                   <option value="Featured">Featured First</option>
                   <option value="A - Z">Alphabetical (A-Z)</option>
                   <option value="Z - A">Alphabetical (Z-A)</option>
                   <option value="Price: Low to High">Price: Low to High</option>
                   <option value="Price: High to Low">Price: High to Low</option>
                 </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {isLoading ? (
                 <div className="col-span-full py-20 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 font-bold text-sm">Loading Catalogue...</p>
                 </div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-gray-300">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                     <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No Products Found</h3>
                  <p className="text-gray-500 text-sm">Try changing your filters or selecting a different category.</p>
                  <button onClick={() => {setActiveCategory('ALL'); setSelectedSeries([]); setIsFeaturedOnly(false);}} className="mt-4 text-red-600 font-bold text-sm hover:underline">Clear All Filters</button>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 4. CATEGORY SHOWCASE */}
      <section className="bg-[#0a0a0a] text-white py-16 sm:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12">
            <div className="w-full md:w-1/2 aspect-[4/3] bg-gray-900 rounded-2xl sm:rounded-3xl relative overflow-hidden border border-gray-800 shadow-2xl group">
              <Image src="/images/category-modular.png" alt="Modern Modular Switches Interior" fill className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80 pointer-events-none"></div>
            </div>
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h4 className="text-red-500 font-black tracking-[0.2em] uppercase mb-2 sm:mb-4 text-[10px] sm:text-xs">Category Showcase</h4>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 uppercase tracking-wide leading-tight">Modular <br className="hidden sm:block"/>Switches</h2>
              <p className="text-gray-400 text-sm sm:text-lg mb-6 sm:mb-8 max-w-md mx-auto md:mx-0">Contemporary modular solutions designed perfectly for modern residential and commercial spaces.</p>
              <button onClick={() => {setActiveCategory("Modular Switches"); window.scrollTo(0,0);}} className="border-b-2 border-red-600 text-white font-bold pb-1 hover:text-red-500 transition-colors uppercase tracking-widest text-[10px] sm:text-sm">
                Explore Modular Range &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DOWNLOAD CTA (🟢 WHITE BACKGROUND UPDATE) */}
      <section id="download" className="bg-gray-50 py-16 sm:py-20 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12 bg-white p-8 sm:p-14 rounded-2xl sm:rounded-[2rem] border border-gray-200 shadow-xl relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-600/10 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="w-full md:w-1/3 flex justify-center relative z-10">
              <div className="w-40 sm:w-48 h-56 sm:h-64 bg-white rounded-r-xl rounded-l-sm shadow-2xl relative flex flex-col border-l-4 sm:border-l-8 border-red-600 overflow-hidden">
                 <div className="flex-grow relative w-full h-full">
                    <Image 
                      src={catalogue?.coverImage || "/images/catalogue-cover.png"} 
                      alt={`Florey Product Catalogue ${catalogue?.edition || '2026-27'}`} 
                      fill 
                      className="object-cover object-top" 
                    />
                 </div>
                 <div className="p-2 sm:p-3 bg-gray-900 border-t border-gray-800 rounded-br-xl text-center relative z-10">
                   <p className="text-[7px] sm:text-[8px] font-black text-white uppercase tracking-widest">Product Manual</p>
                   <p className="text-[9px] sm:text-[10px] font-bold text-red-500">{catalogue?.edition || '2026-27'}</p>
                 </div>
              </div>
            </div>
            
            <div className="w-full md:w-2/3 text-center md:text-left relative z-10">
              <h4 className="text-red-600 font-black tracking-[0.2em] uppercase mb-2 sm:mb-3 text-[10px] sm:text-xs">The Complete Range</h4>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 sm:mb-4 uppercase">{catalogue?.title || "Product & Price Manual"}</h2>
              <p className="text-gray-600 text-xs sm:text-base mb-6 sm:mb-8 max-w-md mx-auto md:mx-0">Explore our comprehensive catalogue for complete product specifications, series details, and item codes.</p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
                
                {/* 🟢 VIEW PDF BUTTON */}
                <button 
                  onClick={handleViewCatalogue}
                  disabled={isViewing || (!catalogue?.fileUrl && !catalogue?.pdfUrl)}
                  className="w-full sm:w-auto bg-red-600 text-white font-bold px-6 sm:px-8 py-3 rounded-full hover:bg-red-700 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm shadow-lg disabled:opacity-50"
                >
                  {isViewing ? "Loading..." : "View Catalogue"}
                </button>

                {/* 🟢 DOWNLOAD PDF BUTTON */}
                <button 
                  onClick={handleDownloadCatalogue}
                  disabled={isDownloading || (!catalogue?.fileUrl && !catalogue?.pdfUrl)}
                  className="w-full sm:w-auto bg-white border border-gray-400 text-gray-800 font-bold px-6 sm:px-8 py-3 rounded-full hover:bg-gray-100 hover:border-gray-500 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50"
                >
                  {isDownloading ? (
                    "Downloading..."
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      Download PDF
                    </>
                  )}
                </button>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// PAGE WRAPPER: Warning hatane ke liye Suspense lagaya gaya hai
export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading Page...</div>}>
       <ProductsContent />
    </Suspense>
  )
}

// ----- REUSABLE PRODUCT CARD -----
function ProductCard({ product }) {
  let badgeText = "";
  if (product.isFeatured) badgeText = "FEATURED";
  else if (product.isNewArrival) badgeText = "NEW"; 
  
  const imageUrl = product.image || (product.images && product.images[0]) || 'https://via.placeholder.com/300?text=No+Image';
  
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 hover:border-red-300 hover:shadow-[0_15px_30px_rgba(220,38,38,0.08)] transition-all duration-300 group flex flex-col h-full">
      
      <div className="relative bg-[#f8f9fa] flex items-center justify-center overflow-hidden border-b border-gray-100 aspect-square p-3 sm:p-6">
        {badgeText && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-600 text-white text-[7px] sm:text-[9px] font-black uppercase tracking-widest px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded z-10 shadow-sm">
            {badgeText}
          </div>
        )}
        <div className="absolute w-3/4 h-3/4 bg-white rounded-full opacity-60 z-0 shadow-inner"></div>
        <div className="relative z-10 w-full h-full group-hover:scale-110 transition-transform duration-700 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={product.name} className="object-contain w-full h-full max-h-[90%]" onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Error' }} />
        </div>
      </div>

      <div className="p-3 sm:p-5 flex flex-col flex-grow bg-white">
        <div className="flex justify-between items-start mb-1">
           <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.series} SERIES</p>
        </div>
        
        <h3 className="font-extrabold text-gray-900 leading-tight mb-2 sm:mb-3 line-clamp-2 text-xs sm:text-base group-hover:text-red-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-auto flex items-end justify-between">
           <div>
              <p className="text-[8px] sm:text-[10px] text-gray-400 font-mono mb-0.5 sm:mb-1">SKU: {product.code}</p>
              <div className="flex items-center gap-1 sm:gap-2">
                 <p className="text-sm sm:text-lg font-black text-gray-900">₹{product.price}</p>
                 {product.originalPrice && <p className="text-[9px] sm:text-[11px] text-gray-400 line-through">₹{product.originalPrice}</p>}
              </div>
           </div>
           <Link href={`/products/${product._id}`} className="bg-gray-100 hover:bg-red-600 text-gray-900 hover:text-white p-2 sm:p-2.5 rounded-lg transition-colors">
             <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
           </Link>
        </div>
      </div>
      
    </div>
  );
}