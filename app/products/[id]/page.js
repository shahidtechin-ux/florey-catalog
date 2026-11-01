"use client";
import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductDetailPage({ params }) {
  const unwrappedParams = use(params);
  const productId = unwrappedParams.id;

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const [productRes, allProductsRes] = await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch(`/api/products`)
        ]);

        const productData = await productRes.json();
        const allProductsData = await allProductsRes.json();
        
        if (productData.success) {
          setProduct(productData.data);
          const initialImg = productData.data.image || (productData.data.images && productData.data.images[0]) || 'https://via.placeholder.com/500?text=No+Image';
          setActiveImage(initialImg);
        } else {
          setError(productData.message || 'Product not found');
        }

        if (allProductsData.success && productData.success) {
          const filteredRelated = allProductsData.data
            .filter(p => p._id !== productId && p.category === productData.data.category) 
            .slice(0, 4);
          
          if (filteredRelated.length < 4) {
             const randomRelated = allProductsData.data.filter(p => p._id !== productId).slice(0, 4);
             setRelatedProducts(randomRelated);
          } else {
             setRelatedProducts(filteredRelated);
          }
        }
      } catch (err) {
        setError('Error connecting to database');
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcfcfd] flex flex-col items-center justify-center text-gray-900">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Loading Experience...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#fcfcfd] flex flex-col items-center justify-center text-gray-900">
        <h2 className="text-3xl font-black mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-8">{error}</p>
        <Link className="bg-red-600 px-8 py-3 rounded-full font-bold text-white hover:bg-red-700 transition-colors" href="/products">
          &larr; Back to Products
        </Link>
      </div>
    );
  }

  const galleryImages = (product.images && product.images.length > 0) 
     ? product.images 
     : [product.image || 'https://via.placeholder.com/500?text=No+Image'];

  // SMART HIGHLIGHTS PARSER (Ye text ko sundar bullet points me todega)
  const formatHighlights = (highlightsStr) => {
    if (!highlightsStr) return [];
    if (Array.isArray(highlightsStr)) return highlightsStr;
    
    let arr = [];
    if (highlightsStr.includes('\n')) {
       arr = highlightsStr.split('\n');
    } else if (highlightsStr.includes(' - ')) {
       arr = highlightsStr.split(' - '); 
    } else if (highlightsStr.includes(',')) {
       arr = highlightsStr.split(',');
    } else {
       arr = [highlightsStr];
    }
    
    // Kachra (stars, dashes) saaf karna
    return arr.map(item => item.replace(/^\*+/, '').replace(/\*+$/, '').replace(/^-/, '').trim()).filter(item => item.length > 0);
  };
  const parsedHighlights = formatHighlights(product.highlights);

  // 🟢 NAYA: WhatsApp Message with correct Number
  const whatsappMessage = encodeURIComponent(`Hello FLOREY Team, I am interested in ${product.name} (Code: ${product.code}). Please share more details.`);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 font-sans pb-20">
      
      {/* 🟢 WHITE THEME BREADCRUMB */}
      <div className="border-b border-gray-200 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs font-bold text-gray-400 flex items-center gap-2 overflow-x-auto whitespace-nowrap uppercase tracking-widest">
            <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-red-600 transition-colors">Products</Link>
            <span>/</span>
            <span className="text-gray-500">{product.category}</span>
            <span>/</span>
            <span className="text-gray-900 truncate max-w-[150px] sm:max-w-xs">{product.name}</span>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* 🟢 MAIN PRODUCT CONTAINER (WHITE BG) */}
        <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-gray-200 shadow-xl overflow-hidden flex flex-col lg:flex-row mb-16">
          
          {/* LEFT: IMAGES */}
          <div className="w-full lg:w-1/2 p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col bg-gray-50/50">
            <div className="relative w-full aspect-square bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center overflow-hidden group mb-6">
              {product.isFeatured && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-sm z-10 shadow-sm">
                  Best Seller
                </div>
              )}
              <div className="relative z-10 w-3/4 h-3/4 group-hover:scale-110 transition-transform duration-700 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={activeImage} 
                  alt={product.name} 
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/500?text=No+Image' }}
                />
              </div>
            </div>

            {galleryImages.length > 1 && (
               <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                  {galleryImages.map((imgUrl, idx) => (
                    <div 
                       key={idx} 
                       onClick={() => setActiveImage(imgUrl)}
                       className={`w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl flex items-center justify-center p-3 cursor-pointer transition-all bg-white ${activeImage === imgUrl ? 'border-2 border-red-600 shadow-md scale-105' : 'border border-gray-200 hover:border-red-300 opacity-70 hover:opacity-100'}`}
                    >
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img src={imgUrl} alt="thumb" className="max-w-full max-h-full object-contain" />
                    </div>
                  ))}
               </div>
            )}
          </div>

          {/* RIGHT: DETAILS */}
          <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-14 flex flex-col justify-center">
            
            <div className="flex items-center justify-between mb-2">
               <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em]">FLOREY <span className="text-red-600">{product.series}</span></p>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
               <div className="bg-gray-100 border border-gray-200 px-3 py-1.5 rounded text-xs font-mono text-gray-600">
                 SKU: <span className="text-gray-900 font-bold">{product.code}</span>
               </div>
               <div className="flex items-center gap-2 text-xs font-bold text-green-600 uppercase tracking-wider bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>In Stock
               </div>
            </div>

            <div className="mb-8 border-l-4 border-red-600 pl-5 py-2">
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em] mb-1">Standard Dealer Price</p>
               <div className="flex items-baseline gap-3">
                  <p className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">₹{Number(product.price || 0).toFixed(2)}</p>
                  {product.originalPrice && (
                    <p className="text-lg sm:text-xl text-gray-400 line-through font-bold">₹{product.originalPrice}</p>
                  )}
               </div>
               <p className="text-[11px] text-gray-500 mt-2 italic font-medium">Taxes extra. B2B discounts applied automatically on bulk quotes.</p>
            </div>

            <div className="mb-8">
               <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest">Product Highlights</h3>
               <ul className="space-y-3">
                  {parsedHighlights.length > 0 ? (
                     parsedHighlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-3">
                           <div className="mt-0.5 w-5 h-5 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                             <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                           </div>
                           <span className="text-sm text-gray-600 font-medium leading-snug">{highlight}</span>
                        </li>
                     ))
                  ) : (
                     <li className="text-sm text-gray-500 italic">No highlights added for this product.</li>
                  )}
               </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
               <Link className="w-full sm:w-1/2 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-4 rounded-xl transition-all shadow-[0_4px_15px_rgba(220,38,38,0.3)] hover:-translate-y-1 uppercase tracking-wider text-sm sm:text-base" href="/contact">
                 Request Bulk Quote
               </Link>
               {/* 🟢 NAYA: WhatsApp Number yahan update kiya gaya hai */}
               <a href={`https://wa.me/917065555127?text=${whatsappMessage}`} target="_blank" rel="noreferrer" className="w-full sm:w-1/2 flex items-center justify-center gap-2 bg-white border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold px-6 py-4 rounded-xl transition-all hover:-translate-y-1 uppercase tracking-wider text-sm sm:text-base shadow-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  WhatsApp
               </a>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-gray-100">
               <div className="text-center">
                  <svg className="w-6 h-6 mx-auto text-gray-400 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{product.warranty || '10 Year Warranty'}</p>
               </div>
               <div className="text-center border-x border-gray-100">
                  <svg className="w-6 h-6 mx-auto text-gray-400 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{product.packaging || 'Secure Packaging'}</p>
               </div>
               <div className="text-center">
                  <svg className="w-6 h-6 mx-auto text-gray-400 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">ISI Certified</p>
               </div>
            </div>

          </div>
        </div>

        {/* 3. LONG DESCRIPTION & TECHNICAL SPECIFICATIONS */}
        <div className="mb-20 bg-white border border-gray-200 shadow-xl rounded-[2rem] p-6 sm:p-10 lg:p-14">
          <div className="border-b border-gray-200 pb-4 mb-8">
             <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest border-b-[3px] border-red-600 inline-block pb-4 -mb-[18px]">Technical Details</h2>
          </div>
          
          {product.description && (
             <div className="mb-10 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-3">Product Description</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium">{product.description}</p>
             </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-0">
            <SpecRow label="Product Code" value={product.code || 'N/A'}/>
            <SpecRow label="Series" value={product.series ? `${product.series} Series` : 'Standard Series'}/>
            <SpecRow label="Category" value={product.category || 'N/A'}/>
            <SpecRow label="Rated Voltage" value={product.voltage || '240V AC'}/>
            <SpecRow label="Material" value={product.material || 'Fire Retardant Polycarbonate'}/>
            <SpecRow label="Color" value={product.color || 'Pure White'}/>
            <SpecRow label="Warranty" value={product.warranty || '10 Years Replacement'}/>
            <SpecRow label="Packaging" value={product.packaging || '10 Pcs / Box'}/>
            <SpecRow label="Manufacturing" value="Made in India"/>
            <SpecRow label="Module Size" value="Standard / Modular"/>
          </div>
        </div>

        {/* 4. RELATED PRODUCTS SECTION */}
        <div className="border-t border-gray-200 pt-16">
           <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-wide">Customers Also Bought</h2>
              <Link href="/products" className="text-red-600 text-sm font-bold uppercase tracking-widest hover:underline hidden sm:block">View All Products &rarr;</Link>
           </div>

           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.length > 0 ? (
                 relatedProducts.map((relProduct) => {
                   const relImageUrl = relProduct.image || (relProduct.images && relProduct.images[0]) || 'https://via.placeholder.com/200?text=No+Image';
                   
                   return (
                     <div key={relProduct._id} className="bg-white rounded-2xl border border-gray-200 hover:border-red-300 hover:shadow-xl transition-all duration-300 group flex flex-col overflow-hidden">
                        <div className="relative aspect-square bg-gray-50 flex items-center justify-center p-6 border-b border-gray-100">
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img src={relImageUrl} alt={relProduct.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=Image' }} />
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                           <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1.5">{relProduct.category}</p>
                           <h3 className="text-sm font-black text-gray-900 line-clamp-2 mb-4 flex-grow group-hover:text-red-600 transition-colors">{relProduct.name}</h3>
                           <div className="flex items-center justify-between mt-auto">
                              <p className="font-black text-lg text-gray-900 tracking-tight">₹{Number(relProduct.price || 0).toFixed(2)}</p>
                              <Link href={`/products/${relProduct._id}`} className="bg-gray-100 hover:bg-red-600 text-gray-700 hover:text-white p-2 rounded-lg transition-colors">
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                              </Link>
                           </div>
                        </div>
                     </div>
                   );
                 })
              ) : (
                 <div className="col-span-full py-10 text-center text-gray-500 border border-gray-200 rounded-2xl border-dashed">
                    No related products found in this category yet.
                 </div>
              )}
           </div>
        </div>
        
      </div>
    </div>
  );
}

// Clean Table-like Row for Specifications (White Theme Version)
function SpecRow({ label, value }) {
   return (
      <div className="py-4 border-b border-gray-100 flex justify-between items-center hover:bg-gray-50 transition-colors px-3 rounded-lg">
         <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
         <span className="text-sm font-bold text-gray-900 text-right">{value}</span>
      </div>
   );
}