"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const getDownloadUrl = (url) => {
  if (!url) return '#';
  return url.replace('/upload/', '/upload/fl_attachment/');
};

export default function ContactPage() {
  const [enquiryType, setEnquiryType] = useState('Product Enquiry');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [referenceId, setReferenceId] = useState('');
  
  const [catalogue, setCatalogue] = useState({ pdfUrl: '', coverImage: '', edition: '2026-27', title: '' });

  const [isViewing, setIsViewing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchCatalogue = async () => {
      try {
        const catRes = await fetch('/api/catalogue');
        const catData = await catRes.json();
        if (catData.success && catData.data) {
           setCatalogue(catData.data);
        }
      } catch (error) {
        console.error("Error fetching catalogue:", error);
      }
    };
    fetchCatalogue();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const refId = "FLR-" + Math.floor(1000 + Math.random() * 9000);

    const payload = {
      referenceId: refId,
      fullName: formData.get('fullName'),
      mobileNumber: formData.get('mobileNumber'),
      email: formData.get('email'),
      enquiryType: enquiryType,
      productDetails: formData.get('productDetails') || '',
      companyName: formData.get('companyName') || '',
      cityState: formData.get('cityState') || '',
      subject: formData.get('subject') || '',
      message: formData.get('message')
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setReferenceId(refId);
        setIsSubmitted(true);
      } else {
        alert("Oops! Kuch technical issue aaya. Please dobara try karein.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Network error! Apna internet connection check karein.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

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

  const faqs = [
    {
      question: "How can I apply for FLOREY distributorship?",
      answer: "Applying for distributorship is easy. Simply fill out the contact form on this page and select 'Distributorship' as the enquiry type. Provide your company and location details, and our business development team will contact you within 24-48 hours."
    },
    {
      question: "Do FLOREY products come with a warranty?",
      answer: "Yes, absolutely. We stand behind our quality. Our premium modular switches come with an industry-leading 10-year manufacturer warranty against manufacturing defects."
    },
    {
      question: "How long does it take to process an enquiry?",
      answer: "We strive to respond to all product and general enquiries within 24 hours during regular business days. Distributorship applications may take up to 48 hours for an initial review."
    },
    {
      question: "Where can I find the complete product catalogue?",
      answer: "You can download our latest Product & Price Manual directly from the Catalogue section on this page, or visit our dedicated Products page to browse the range online."
    },
    {
      question: "Are FLOREY switches made of fire-retardant material?",
      answer: "Yes, safety is our core value. All FLOREY switches and sockets are manufactured using high-grade Fire Retardant Virgin Polycarbonate material, ensuring maximum safety against electrical hazards."
    }
  ];

  return (
    <div className="bg-[#fcfcfd] min-h-screen font-sans">
      
      {/* 01. PREMIUM HERO SECTION (Mobile Optimized & Modern Vibe) */}
      <section className="bg-[#0a0b0f] text-white pt-24 pb-16 sm:pt-32 sm:pb-24 border-b-[3px] sm:border-b-[4px] border-red-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] sm:w-[600px] sm:h-[600px] bg-red-600/15 blur-[60px] sm:blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 z-0"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
            
            <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6 text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-black leading-[1.1] uppercase tracking-tight text-white">
                LET'S START A <br className="hidden sm:block"/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">CONVERSATION.</span>
              </h1>
              
              <p className="text-gray-400 text-sm sm:text-[17px] leading-relaxed max-w-lg font-medium mx-auto sm:mx-0">
                Step into the modern world of luxury electricals. Premium product enquiries, exclusive business partnerships aur smart solutions ke liye hamari expert team se connect karein.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 pt-4 sm:pt-4 w-full sm:w-auto mx-auto sm:mx-0 max-w-[280px] sm:max-w-none">
                <a href="#enquiry-form" className="w-full sm:w-auto text-white font-bold text-sm sm:text-base hover:text-red-500 transition-all flex items-center justify-center gap-2 group py-3.5 sm:py-0 border border-gray-800 sm:border-none rounded-xl sm:rounded-none">
                  Send an Enquiry 
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
                
                <a href="https://wa.me/917065555127" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-[#25D366] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#1ebd5a] transition-all text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.15)]">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.124.552 4.195 1.597 6.015L.135 24l6.113-1.605A11.968 11.968 0 0012.031 24c6.645 0 12.031-5.385 12.031-12.031S18.676 0 12.031 0zm0 21.996c-1.802 0-3.567-.485-5.113-1.405l-.367-.217-3.795.996.996-3.795-.217-.367c-.92-1.546-1.405-3.311-1.405-5.113 0-5.54 4.507-10.047 10.047-10.047 5.54 0 10.047 4.507 10.047 10.047 0 5.54-4.507 10.047-10.047 10.047zm5.518-7.533c-.302-.152-1.787-.883-2.063-.984-.277-.101-.478-.152-.68.152-.202.303-.782.984-.958 1.186-.176.202-.353.227-.655.076-1.554-.78-2.678-1.516-3.682-3.238-.176-.303.176-.277.478-.883.101-.202.05-.38-.025-.531-.076-.152-.68-1.642-.932-2.247-.245-.591-.496-.511-.68-.521h-.58c-.202 0-.53.076-.807.38-.277.303-1.058 1.036-1.058 2.526s1.084 2.93 1.235 3.132c.152.202 2.138 3.262 5.179 4.575 1.942.84 2.68.908 3.655.76.711-.11 2.222-.91 2.535-1.789.313-.88.313-1.642.22-1.794-.093-.152-.345-.253-.647-.404z"/></svg>
                  WhatsApp Us
                </a>
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex justify-end">
              <div className="relative w-full aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-gray-800 bg-[#050505]">
                <Image 
                  src="/images/category-modular.png" 
                  alt="Premium Florey Switch" 
                  fill
                  className="object-cover sm:object-contain hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 02. CHOOSE YOUR ENQUIRY TYPE (Mobile 2-Column Grid) */}
      <section className="py-12 sm:py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-3xl font-black text-gray-900 uppercase">Choose Your Enquiry Type</h2>
            <div className="w-10 sm:w-12 h-1 bg-red-600 rounded-full mt-2.5 sm:mt-4 mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <button onClick={() => setEnquiryType('Product Enquiry')} className={`p-4 sm:p-8 rounded-xl sm:rounded-2xl border transition-all text-left flex flex-col items-center sm:items-start group ${enquiryType === 'Product Enquiry' ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-[#f8f9fa] border-gray-100 hover:border-gray-300'}`}>
              <div className="text-red-600 mb-2 sm:mb-4 bg-white p-2 sm:p-2.5 rounded-lg sm:rounded-xl shadow-sm">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <h3 className="font-bold text-gray-900 text-[11px] sm:text-lg mb-1 text-center sm:text-left w-full leading-tight">Product Enquiry</h3>
              <p className="text-gray-500 text-[9px] sm:text-sm text-center sm:text-left w-full hidden sm:block">Product details & specifications</p>
            </button>

            <button onClick={() => setEnquiryType('Distributorship')} className={`p-4 sm:p-8 rounded-xl sm:rounded-2xl border transition-all text-left flex flex-col items-center sm:items-start group ${enquiryType === 'Distributorship' ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-[#f8f9fa] border-gray-100 hover:border-gray-300'}`}>
              <div className="text-red-600 mb-2 sm:mb-4 bg-white p-2 sm:p-2.5 rounded-lg sm:rounded-xl shadow-sm">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="font-bold text-gray-900 text-[11px] sm:text-lg mb-1 text-center sm:text-left w-full leading-tight">Distributorship</h3>
              <p className="text-gray-500 text-[9px] sm:text-sm text-center sm:text-left w-full hidden sm:block">Business partnership enquiries</p>
            </button>

            <button onClick={() => setEnquiryType('General Question')} className={`p-4 sm:p-8 rounded-xl sm:rounded-2xl border transition-all text-left flex flex-col items-center sm:items-start group ${enquiryType === 'General Question' ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-[#f8f9fa] border-gray-100 hover:border-gray-300'}`}>
              <div className="text-red-600 mb-2 sm:mb-4 bg-white p-2 sm:p-2.5 rounded-lg sm:rounded-xl shadow-sm">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <h3 className="font-bold text-gray-900 text-[11px] sm:text-lg mb-1 text-center sm:text-left w-full leading-tight">General Support</h3>
              <p className="text-gray-500 text-[9px] sm:text-sm text-center sm:text-left w-full hidden sm:block">Questions about our range</p>
            </button>

            <button onClick={() => setEnquiryType('Catalogue Request')} className={`p-4 sm:p-8 rounded-xl sm:rounded-2xl border transition-all text-left flex flex-col items-center sm:items-start group ${enquiryType === 'Catalogue Request' ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-[#f8f9fa] border-gray-100 hover:border-gray-300'}`}>
              <div className="text-red-600 mb-2 sm:mb-4 bg-white p-2 sm:p-2.5 rounded-lg sm:rounded-xl shadow-sm">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h3 className="font-bold text-gray-900 text-[11px] sm:text-lg mb-1 text-center sm:text-left w-full leading-tight">Catalogue</h3>
              <p className="text-gray-500 text-[9px] sm:text-sm text-center sm:text-left w-full hidden sm:block">Explore the product manual</p>
            </button>
          </div>
        </div>
      </section>

      {/* 03. CONTACT INFO + ENQUIRY FORM */}
      <section id="enquiry-form" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="flex flex-col lg:flex-row rounded-2xl sm:rounded-[24px] overflow-hidden shadow-[0_5px_30px_rgba(0,0,0,0.06)] border border-gray-200">
          
          {/* 🟢 LEFT: Contact Information (Deep Blue Background) */}
          <div className="w-full lg:w-2/5 bg-[#0c2340] text-white p-6 sm:p-12 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] bg-blue-500/20 blur-[60px] sm:blur-[80px] rounded-full"></div>
            
            <h4 className="text-blue-300 font-bold tracking-[0.2em] uppercase mb-1.5 sm:mb-2 text-[10px] sm:text-xs">Reach Out</h4>
            <h2 className="text-2xl sm:text-4xl font-black mb-6 sm:mb-8 leading-tight">Contact <br className="hidden sm:block"/>Information.</h2>

            <div className="space-y-6 sm:space-y-8 relative z-10 flex-grow">
              
              {/* Phone & WhatsApp (Clickable) */}
              <div className="flex items-start gap-3 sm:gap-4 group">
                <a href="tel:+9170655 55127" className="w-10 h-10 bg-white/10 text-blue-300 rounded-full flex items-center justify-center shrink-0 mt-1 group-hover:bg-blue-500 group-hover:text-white transition-colors cursor-pointer">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </a>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-gray-300 uppercase tracking-widest mb-0.5 sm:mb-1">Phone & WhatsApp</h3>
                  <a href="tel:+917065555127" className="text-base sm:text-xl font-bold hover:text-blue-300 transition-colors block">+91 7065555127</a>
                  <a href="https://wa.me/917065555127" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm font-medium text-green-400 hover:text-green-300 mt-1 flex items-center gap-1.5 transition-colors">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
              
              {/* Email (Clickable) */}
              <div className="flex items-start gap-3 sm:gap-4 group">
                <a href="mailto:floreyflorey11@gmail.com" className="w-10 h-10 bg-white/10 text-blue-300 rounded-full flex items-center justify-center shrink-0 mt-1 group-hover:bg-blue-500 group-hover:text-white transition-colors cursor-pointer">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </a>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-gray-300 uppercase tracking-widest mb-0.5 sm:mb-1">Email Address</h3>
                  <a href="mailto:floreyflorey11@gmail.com" className="text-base sm:text-xl font-bold hover:text-blue-300 transition-colors break-all">floreyflorey11@gmail.com</a>
                </div>
              </div>

              {/* Business Address (Google Maps) */}
              <div className="flex items-start gap-3 sm:gap-4 group">
                <a href="https://www.google.com/maps/search/?api=1&query=Noida+Sector+69+B+-+19,+Uttar+Pradesh,+India" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 text-blue-300 rounded-full flex items-center justify-center shrink-0 mt-1 group-hover:bg-blue-500 group-hover:text-white transition-colors cursor-pointer">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </a>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-gray-300 uppercase tracking-widest mb-0.5 sm:mb-1">Business Address</h3>
                  <a href="https://www.google.com/maps/search/?api=1&query=Noida+Sector+69+B+-+19,+Uttar+Pradesh,+India" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-lg font-bold leading-snug hover:text-blue-300 transition-colors block">
                    Shajjad Electronics<br/>Noida sector 69 B - 19<br/>Uttar Pradesh, India
                  </a>
                </div>
              </div>
            </div>
            
            {/* 🟢 Social Media Icons Update */}
            <div className="mt-8 pt-6 border-t border-blue-400/20 flex gap-3 sm:gap-4">
               {/* Instagram */}
               <a href="https://www.instagram.com/florey_shajjad_electronics?vrfl=MWZ5ZnNlNHp0dzBoaA==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-red-500 transition-colors">
                  <svg className="w-4 h-4 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
               </a>
               {/* YouTube */}
               <a href="https://youtube.com/@floreyshajjadelectronics?si=UsKObN2Jqm11ZCbJ" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-red-600 transition-colors">
                  <svg className="w-5 h-5 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
               </a>
               {/* WhatsApp */}
               <a href="https://wa.me/917065555127" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-green-500 transition-colors">
                  <svg className="w-4 h-4 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
               </a>
               {/* Facebook (Inactive/Placeholder) */}
               <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 cursor-not-allowed" title="Coming Soon">
                  <svg className="w-4 h-4 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
               </a>
            </div>
          </div>

          {/* RIGHT: Professional Enquiry Form */}
          <div className="w-full lg:w-3/5 bg-white p-6 sm:p-12 lg:p-16 border-t lg:border-t-0 border-gray-200">
            <h2 className="text-xl sm:text-3xl font-black text-gray-900 mb-1 sm:mb-2">Send an Enquiry</h2>
            <p className="text-gray-500 text-xs sm:text-sm mb-6 sm:mb-8">Fill in the details below and we will get back to you.</p>

            {isSubmitted ? (
              <div className="bg-[#f8fcf9] border border-green-200 p-6 sm:p-8 rounded-2xl flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-1.5 sm:mb-2">Message Sent Successfully!</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-4">Thank you for contacting FLOREY. Our team will review your enquiry.</p>
                <div className="bg-white border border-gray-200 px-4 sm:px-6 py-2 sm:py-3 rounded-lg w-full sm:w-auto">
                  <p className="text-[10px] sm:text-xs uppercase font-bold text-gray-400 tracking-widest mb-1">Enquiry Reference ID</p>
                  <p className="text-base sm:text-lg font-mono font-bold text-gray-900">{referenceId}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wider">Full Name <span className="text-red-500">*</span></label>
                    <input name="fullName" required type="text" className="w-full bg-[#f8f9fa] border border-gray-200 text-gray-900 rounded-xl px-4 py-3 sm:py-3.5 focus:outline-none focus:border-gray-400 transition-colors text-sm" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wider">Mobile Number <span className="text-red-500">*</span></label>
                    <input name="mobileNumber" required type="tel" className="w-full bg-[#f8f9fa] border border-gray-200 text-gray-900 rounded-xl px-4 py-3 sm:py-3.5 focus:outline-none focus:border-gray-400 transition-colors text-sm" placeholder="Your phone number" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wider">Email Address <span className="text-gray-400 normal-case font-normal">(Optional)</span></label>
                    <input name="email" type="email" className="w-full bg-[#f8f9fa] border border-gray-200 text-gray-900 rounded-xl px-4 py-3 sm:py-3.5 focus:outline-none focus:border-gray-400 transition-colors text-sm" placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wider">Enquiry Type <span className="text-red-500">*</span></label>
                    <select 
                      name="enquiryType"
                      value={enquiryType}
                      onChange={(e) => setEnquiryType(e.target.value)}
                      className="w-full bg-[#f8f9fa] border border-gray-200 text-gray-900 rounded-xl px-4 py-3 sm:py-3.5 focus:outline-none focus:border-gray-400 transition-colors text-sm cursor-pointer appearance-none"
                    >
                      <option value="Product Enquiry">Product Enquiry</option>
                      <option value="Distributorship">Distributorship</option>
                      <option value="General Question">General Question</option>
                      <option value="Catalogue Request">Catalogue Request</option>
                    </select>
                  </div>
                </div>

                {/* CONDITIONAL FIELDS */}
                {(enquiryType === 'Product Enquiry' || enquiryType === 'Catalogue Request') && (
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wider">Product Name / Code <span className="text-gray-400 normal-case font-normal">(Optional)</span></label>
                    <input name="productDetails" type="text" className="w-full bg-[#f8f9fa] border border-gray-200 text-gray-900 rounded-xl px-4 py-3 sm:py-3.5 focus:outline-none focus:border-gray-400 transition-colors text-sm" placeholder="e.g. FL-G1001" />
                  </div>
                )}

                {enquiryType === 'Distributorship' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wider">Company Name <span className="text-red-500">*</span></label>
                      <input name="companyName" required type="text" className="w-full bg-[#f8f9fa] border border-gray-200 text-gray-900 rounded-xl px-4 py-3 sm:py-3.5 focus:outline-none focus:border-gray-400 transition-colors text-sm" placeholder="Your firm name" />
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wider">City & State <span className="text-red-500">*</span></label>
                      <input name="cityState" required type="text" className="w-full bg-[#f8f9fa] border border-gray-200 text-gray-900 rounded-xl px-4 py-3 sm:py-3.5 focus:outline-none focus:border-gray-400 transition-colors text-sm" placeholder="e.g. Delhi, NCR" />
                    </div>
                  </div>
                )}

                {enquiryType === 'General Question' && (
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wider">Subject <span className="text-gray-400 normal-case font-normal">(Optional)</span></label>
                    <input name="subject" type="text" className="w-full bg-[#f8f9fa] border border-gray-200 text-gray-900 rounded-xl px-4 py-3 sm:py-3.5 focus:outline-none focus:border-gray-400 transition-colors text-sm" placeholder="What is this regarding?" />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wider">Your Message <span className="text-red-500">*</span></label>
                  <textarea name="message" required rows="4" className="w-full bg-[#f8f9fa] border border-gray-200 text-gray-900 rounded-xl px-4 py-3 sm:py-3.5 focus:outline-none focus:border-gray-400 transition-colors text-sm resize-none" placeholder="Tell us how we can help..."></textarea>
                </div>

                <div className="pt-2 flex items-start gap-2 sm:gap-3">
                  <input name="consent" required type="checkbox" id="consent" className="mt-1 w-4 h-4 sm:w-4 sm:h-4 text-red-600 rounded border-gray-300 focus:ring-red-600 cursor-pointer shrink-0" />
                  <label htmlFor="consent" className="text-xs sm:text-sm text-gray-500 cursor-pointer leading-tight">
                    I agree to the <Link href="#" className="underline">Privacy Policy</Link> and consent to FLOREY contacting me regarding my enquiry.
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`w-full text-white font-bold px-6 py-3.5 sm:py-4 rounded-xl transition-all text-sm uppercase tracking-widest mt-4 sm:mt-6 flex justify-center items-center gap-2 ${isLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow-[0_4px_15px_rgba(220,38,38,0.3)]'}`}
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Sending Details...
                    </>
                  ) : (
                    <>
                      Submit Enquiry
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 04. OUR LOCATION */}
      <section className="py-10 sm:py-16 bg-white border-y border-gray-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#f8f9fa] rounded-2xl sm:rounded-3xl p-6 sm:p-12 border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 text-center md:text-left">
               <div>
                 <h4 className="text-gray-500 font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-1.5 sm:mb-2">Corporate Office</h4>
                 <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-1.5 sm:mb-2">Florey | Shajjad Electronics HQ</h2>
                 <p className="text-gray-600 text-xs sm:text-sm">Noida Sector 69 B - 19, Uttter Pradesh, India</p>
               </div>
               <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto shrink-0">
                  <div className="bg-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-gray-200 shadow-sm text-center w-full sm:w-auto">
                    <p className="text-[10px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Business Hours</p>
                    <p className="font-bold text-gray-900 text-xs sm:text-sm">Mon-Sat: 9 AM - 6 PM</p>
                  </div>
                  <div className="bg-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-gray-200 shadow-sm text-center w-full sm:w-auto">
                    <p className="text-[10px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Support Status</p>
                    <p className="font-bold text-green-600 text-xs sm:text-sm flex items-center justify-center gap-1.5"><span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse"></span> Active Now</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 05. PRODUCT CATALOGUE BANNER (🟢 WHITE BACKGROUND UPDATE) */}
      <section className="py-10 sm:py-16 bg-gray-50 text-gray-900 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-12 border border-gray-200 shadow-xl flex flex-col md:flex-row items-center gap-6 md:gap-12 relative overflow-hidden">
             
             <div className="w-full md:w-1/3 flex justify-center z-10 relative">
               <div className="w-32 h-44 sm:w-40 sm:h-56 bg-white rounded-r-lg shadow-2xl border-l-8 border-red-600 flex flex-col overflow-hidden relative">
                  <div className="flex-grow relative">
                    <Image 
                      src={catalogue?.coverImage || "/images/catalogue-cover.png"} 
                      alt={`Catalogue ${catalogue?.edition || '2026-27'}`} 
                      fill 
                      className="object-cover object-top" 
                    />
                  </div>
                  <div className="p-1.5 sm:p-2 bg-gray-900 text-center relative z-10">
                    <p className="text-[7px] sm:text-[7px] font-black text-white uppercase tracking-widest">Product Manual</p>
                    <p className="text-[9px] sm:text-[9px] font-bold text-red-500">{catalogue?.edition || '2026-27'}</p>
                  </div>
               </div>
             </div>

             <div className="w-full md:w-2/3 text-center md:text-left z-10 relative">
               <h4 className="text-red-600 font-black tracking-widest uppercase mb-1.5 sm:mb-2 text-[10px] sm:text-xs">Complete Collection</h4>
               <h2 className="text-xl sm:text-3xl font-black mb-2 sm:mb-4 uppercase leading-tight text-gray-900">{catalogue?.title || "Product & Price Manual"}</h2>
               <p className="text-gray-600 text-xs sm:text-sm mb-6 sm:mb-8">Download our complete catalogue for detailed specifications, series information, and distributorship pricing structures.</p>
               
               <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start w-full sm:w-auto">
                 {/* 🟢 VIEW PDF BUTTON */}
                 <button 
                   onClick={handleViewCatalogue}
                   disabled={isViewing || (!catalogue?.fileUrl && !catalogue?.pdfUrl)}
                   className="w-full sm:w-auto bg-red-600 text-white font-bold px-6 py-3 sm:py-3.5 rounded-xl hover:bg-red-700 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                 >
                   {isViewing ? "Loading..." : "View Online"}
                 </button>

                 {/* 🟢 DOWNLOAD PDF BUTTON */}
                 <button 
                   onClick={handleDownloadCatalogue}
                   disabled={isDownloading || (!catalogue?.fileUrl && !catalogue?.pdfUrl)}
                   className="w-full sm:w-auto bg-white border border-gray-400 text-gray-800 font-bold px-6 py-3 sm:py-3.5 rounded-xl hover:bg-gray-100 hover:border-gray-500 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50"
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

      {/* 06. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-12 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-3xl font-black text-gray-900 uppercase">Frequently Asked Questions</h2>
            <div className="w-10 sm:w-12 h-1 bg-red-600 rounded-full mt-3 sm:mt-4 mx-auto"></div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden">
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 sm:p-6 bg-[#f8f9fa] hover:bg-gray-100 transition-colors text-left"
                >
                  <span className="font-bold text-gray-900 text-xs sm:text-base pr-4">{faq.question}</span>
                  <div className={`shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${openFaq === index ? 'bg-red-600 text-white rotate-180' : 'bg-white border border-gray-300 text-gray-500'}`}>
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </button>
                <div className={`px-4 sm:px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-48 py-4 sm:py-6 border-t border-gray-200' : 'max-h-0 py-0'}`}>
                  <p className="text-gray-600 text-[11px] sm:text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 07. FINAL CTA */}
      <section className="bg-[#0a0b0f] text-white py-12 sm:py-24 border-t-[3px] sm:border-t-[4px] border-red-600 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black mb-6 sm:mb-8 tracking-tight uppercase leading-tight">
            INTERESTED IN <br className="hidden sm:block"/> FLOREY PRODUCTS?
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full mx-auto sm:mx-0 max-w-sm sm:max-w-none">
            <a href="#enquiry-form" className="w-full sm:w-auto bg-white text-gray-900 font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl hover:bg-gray-200 transition-all text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2">
              Send an Enquiry &rarr;
            </a>
            <Link href="/distributorship" className="w-full sm:w-auto bg-transparent border border-gray-600 text-white font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl hover:border-red-600 hover:text-red-500 transition-all text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2">
              Become a Distributor &rarr;
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}