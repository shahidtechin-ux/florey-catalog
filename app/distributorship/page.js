"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function DistributorshipPage() {
  const [formStep, setFormStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  
  // 🟢 FIX 1: Saare inputs ka data ek jagah store karne ke liye State
  const [formValues, setFormValues] = useState({
    fullName: '', mobileNumber: '', email: '',
    companyName: '', gstNumber: '', businessType: '', state: '', city: '', pincode: '',
    aadhaarNumber: '', panNumber: '',
    experience: '', interest: '', message: ''
  });

  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [aadhaarData, setAadhaarData] = useState(null);
  
  const [panFile, setPanFile] = useState(null);
  const [panData, setPanData] = useState(null);

  // 🟢 FIX 2: Jab bhi input me kuch type ho, wo state me save ho jaye
  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  // 🟢 FIX 3: Next dabane par check karega ki required field bhari hai ya nahi
  const handleNext = () => {
    if (formStep === 1) {
      if (!formValues.fullName || !formValues.mobileNumber) {
        alert("Kripya Apna Naam aur Mobile Number zaroor bharein.");
        return;
      }
    }
    if (formStep === 2) {
      if (!formValues.companyName || !formValues.city) {
        alert("Kripya Apni Company ka naam aur City zaroor bharein.");
        return;
      }
    }
    if (formStep === 3) {
      if (!formValues.aadhaarNumber || !aadhaarData || !formValues.panNumber || !panData) {
        alert("Kripya Aadhaar aur PAN detail aur unki photos upload karein.");
        return;
      }
    }
    setFormStep((prev) => prev + 1);
  };

  const handleBack = () => setFormStep((prev) => prev - 1);

  const handleFileChange = (e, setFileState, setDataState) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileState(file.name);
      
      const reader = new FileReader();
      reader.onloadend = () => setDataState(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Form data ko sahi se payload me bhejna
    const payload = {
      ...formValues,
      aadhaarData: aadhaarData,
      panData: panData
    };

    try {
      const response = await fetch('/api/distributorship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();

      if (result.success) {
        setApplicationId(result.applicationId);
        setIsSubmitting(false);
        setIsSuccess(true);
      } else {
        alert("Error: " + result.message);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Network error! Apna internet connection check karein.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 font-sans">
      
      {/* 1. PREMIUM HERO SECTION */}
      <section className="relative w-full bg-gray-900 border-b-[4px] border-red-600">
        <img src="/images/distributor-banner.png" alt="Florey Distributorship Banner" className="w-full h-auto block" />
        <div className="absolute bottom-[4%] sm:bottom-[6%] md:bottom-[8%] lg:bottom-[10%] left-[4%] sm:left-[6%] z-10 flex flex-row flex-nowrap gap-2 sm:gap-4 w-auto">
          <Link href="/contact" className="bg-black/40 backdrop-blur-sm text-white font-bold px-4 py-2 sm:px-8 sm:py-3.5 rounded-full border-[1.5px] sm:border-2 border-white hover:bg-white hover:text-gray-900 transition-all text-center text-[10px] sm:text-sm md:text-base whitespace-nowrap flex items-center justify-center">
            Talk to Us
          </Link>
          <a href="#apply" className="bg-red-600 text-white font-bold px-4 py-2 sm:px-8 sm:py-3.5 rounded-full shadow-[0_4px_15px_rgba(220,38,38,0.5)] hover:bg-red-700 hover:-translate-y-1 transition-all text-center text-[10px] sm:text-sm md:text-base whitespace-nowrap flex items-center justify-center">
            Apply for Distributorship &rarr;
          </a>
        </div>
      </section>

      {/* 2. WHY PARTNER WITH US? */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 uppercase tracking-wide">Why Partner With Florey?</h2>
          <div className="w-20 h-1.5 bg-red-600 mx-auto mt-4 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <FeatureCard num="01" title="Complete Product Range" desc="Switches, sockets, lighting, protection and premium electrical accessories." />
          <FeatureCard num="02" title="Product-Focused Catalogue" desc="Clear product specifications, series details, and comprehensive product information." />
          <FeatureCard num="03" title="Business Partnership" desc="A structured and reliable channel for dealers and distributors to connect with the business." />
          <FeatureCard num="04" title="Dedicated Support" desc="Direct communication channel for application updates and business-related queries." />
        </div>
      </section>

      {/* 3. PRODUCT CATEGORIES */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h4 className="text-red-600 font-bold tracking-[0.2em] uppercase mb-2 text-xs sm:text-sm">Portfolio</h4>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-10">EXPLORE THE RANGE</h2>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10">
            {["Modular Switches", "Sockets & Accessories", "Dimmers & Regulators", "MCBs & Protection", "LED Lighting", "Electrical Accessories", "Wires & Cables", "PC/GEM/CRYSTAL Series"].map((cat, i) => (
              <span key={i} className="px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold rounded-full hover:border-red-400 hover:text-red-600 cursor-pointer transition-colors">{cat}</span>
            ))}
          </div>
          <Link href="/products" className="inline-flex items-center gap-2 text-red-600 font-bold hover:text-red-800 transition-colors">
            Explore All Products <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </section>

      {/* 4. WHO CAN APPLY? */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 uppercase tracking-wide">Who Can Partner With Us?</h2>
          <div className="w-20 h-1.5 bg-red-600 mt-4 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-6"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Electrical Dealers</h3>
            <p className="text-gray-500 text-sm">For established electrical product retailers looking to add premium ranges.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-6"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg></div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Distributors</h3>
            <p className="text-gray-500 text-sm">For businesses looking to distribute FLOREY products across their regional market.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-6"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Electrical Businesses</h3>
            <p className="text-gray-500 text-sm">For businesses with relevant market presence and strong distribution experience.</p>
          </div>
        </div>
      </section>

      {/* 5. APPLICATION PROCESS */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide">Application Process</h2>
            <div className="w-16 h-1 bg-red-600 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-6 left-[15%] w-[70%] h-[2px] border-t-2 border-dashed border-gray-700"></div>
            <ProcessStep num="01" title="Submit Application" desc="Fill in your business and KYC details securely." />
            <ProcessStep num="02" title="Application Review" desc="Our team reviews the submitted information." />
            <ProcessStep num="03" title="Team Connects" desc="We contact you for the next steps or details." />
            <ProcessStep num="04" title="Partnership Decision" desc="Application is approved or rejected after review." />
          </div>
        </div>
      </section>

      {/* 6. 🔥 MAIN APPLICATION FORM */}
      <section id="apply" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isSuccess ? (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Left Content */}
            <div className="w-full lg:w-5/12">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase leading-tight mb-4">Start Your <br/><span className="text-red-600">Application</span></h2>
              <p className="text-gray-500 text-lg mb-10">Tell us about your business and the market you operate in. Join the growing network of FLOREY partners.</p>
              
              <div className="hidden lg:block bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Secure Application & KYC
                </h4>
                <p className="text-sm text-gray-500 mb-4">Your personal data, KYC documents, and business details are strictly confidential. Our team will manually review your profile before processing the distributorship agreement.</p>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest border-t border-gray-100 pt-4">Shajjad Electronics</div>
              </div>
            </div>

            {/* Right Form (Multi-Step) */}
            <div className="w-full lg:w-7/12 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-10 relative overflow-hidden">
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
                <div className={`h-full bg-red-600 transition-all duration-500 ${formStep === 1 ? 'w-1/4' : formStep === 2 ? 'w-2/4' : formStep === 3 ? 'w-3/4' : 'w-full'}`}></div>
              </div>

              <h3 className="text-2xl font-extrabold text-gray-900 mb-2 mt-2">Distributorship Form</h3>
              <p className="text-sm text-gray-500 mb-8">Step {formStep} of 4: {formStep === 1 ? 'Personal Details' : formStep === 2 ? 'Location & Business' : formStep === 3 ? 'KYC Documents' : 'Final Details'}</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* STEP 1: Personal Details */}
                {formStep === 1 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                      <input type="text" name="fullName" value={formValues.fullName} onChange={handleInputChange} required placeholder="Enter your name" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Mobile Number <span className="text-red-500">*</span></label>
                      <input type="tel" name="mobileNumber" value={formValues.mobileNumber} onChange={handleInputChange} required placeholder="+91" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
                      <input type="email" name="email" value={formValues.email} onChange={handleInputChange} placeholder="email@example.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600" />
                    </div>
                    <button type="button" onClick={handleNext} className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-black transition-colors mt-4">
                      Next Step &rarr;
                    </button>
                  </div>
                )}

                {/* STEP 2: Business & Location */}
                {formStep === 2 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Business / Company Name <span className="text-red-500">*</span></label>
                      <input type="text" name="companyName" value={formValues.companyName} onChange={handleInputChange} required placeholder="Shop or Company Name" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">GST Number <span className="text-gray-400 font-normal">(Optional)</span></label>
                      <input type="text" name="gstNumber" value={formValues.gstNumber} onChange={handleInputChange} placeholder="Enter GSTIN (if registered)" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 uppercase" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Business Type</label>
                        <select name="businessType" value={formValues.businessType} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600">
                          <option value="">Select Type</option>
                          <option>Electrical Retailer</option>
                          <option>Wholesale Distributor</option>
                          <option>Contractor</option>
                          <option>New Business</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">State</label>
                        <select name="state" value={formValues.state} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600">
                          <option value="">Select State</option>
                          <option>Delhi</option>
                          <option>Uttar Pradesh</option>
                          <option>Haryana</option>
                          <option>Rajasthan</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">City <span className="text-red-500">*</span></label>
                        <input type="text" name="city" value={formValues.city} onChange={handleInputChange} required placeholder="City" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Pincode</label>
                        <input type="text" name="pincode" value={formValues.pincode} onChange={handleInputChange} placeholder="e.g. 110006" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600" />
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <button type="button" onClick={handleBack} className="w-1/3 bg-white border border-gray-300 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors">Back</button>
                      <button type="button" onClick={handleNext} className="w-2/3 bg-gray-900 text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-black transition-colors">Next Step &rarr;</button>
                    </div>
                  </div>
                )}

                {/* STEP 3: KYC Documents */}
                {formStep === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                      <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-900 mb-1.5">Aadhaar Card Number <span className="text-red-500">*</span></label>
                        <input type="text" name="aadhaarNumber" value={formValues.aadhaarNumber} onChange={handleInputChange} required placeholder="12 Digit Aadhaar No." maxLength="12" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 tracking-widest" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Upload Aadhaar Photo <span className="text-red-500">*</span></label>
                        <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-white transition-colors">
                          <input type="file" name="aadhaarImage" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, setAadhaarFile, setAadhaarData)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                          <svg className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                          <span className="text-sm font-bold text-red-600">{aadhaarFile ? aadhaarFile : "Choose file to upload"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                      <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-900 mb-1.5">PAN Card Number <span className="text-red-500">*</span></label>
                        <input type="text" name="panNumber" value={formValues.panNumber} onChange={handleInputChange} required placeholder="10 Digit PAN No." maxLength="10" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 uppercase tracking-widest" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Upload PAN Photo <span className="text-red-500">*</span></label>
                        <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-white transition-colors">
                          <input type="file" name="panImage" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, setPanFile, setPanData)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                          <svg className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                          <span className="text-sm font-bold text-red-600">{panFile ? panFile : "Choose file to upload"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={handleBack} className="w-1/3 bg-white border border-gray-300 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors">Back</button>
                      <button type="button" onClick={handleNext} className="w-2/3 bg-gray-900 text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-black transition-colors">Next Step &rarr;</button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Final Details & Submit */}
                {formStep === 4 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Years in Business</label>
                        <select name="experience" value={formValues.experience} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600">
                          <option value="">Select Experience</option>
                          <option>0 - 2 Years (New)</option>
                          <option>3 - 5 Years</option>
                          <option>5+ Years</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Interested Categories</label>
                        <select name="interest" value={formValues.interest} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600">
                          <option value="">All Products (Full Range)</option>
                          <option>Only Switches & Sockets</option>
                          <option>Only MCBs & Wires</option>
                          <option>Only Lighting</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Message / Details</label>
                      <textarea name="message" value={formValues.message} onChange={handleInputChange} rows="3" placeholder="Tell us about your business setup..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 resize-none"></textarea>
                    </div>
                    
                    <div className="flex items-start gap-3 mt-4">
                      <input type="checkbox" required className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                      <p className="text-xs text-gray-500 leading-tight">
                        I agree to be contacted by Shajjad Electronics regarding my distributorship application and consent to their privacy policy.
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button type="button" onClick={handleBack} disabled={isSubmitting} className="w-1/3 bg-white border border-gray-300 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50">
                        Back
                      </button>
                      <button type="submit" disabled={isSubmitting} className="w-2/3 bg-red-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-red-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-70">
                        {isSubmitting ? (
                          <><svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...</>
                        ) : (
                          "Submit Application"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        ) : (
          /* PREMIUM POST-SUBMISSION STATE */
          <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-16 text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-100">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            
            <h4 className="text-gray-400 font-bold tracking-[0.2em] uppercase mb-2 text-sm">Application Received</h4>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
              Thank you{formValues.fullName ? `, ${formValues.fullName}` : ''}.
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto">
              Your distributorship application has been successfully submitted. Our business team will review your profile and contact you soon.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 max-w-sm mx-auto mb-10">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Application ID</p>
              <p className="text-2xl font-black text-gray-900 tracking-wider font-mono">{applicationId}</p>
            </div>

            <Link href="/">
              <button className="bg-gray-900 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:bg-black transition-colors">
                &larr; Back to Website
              </button>
            </Link>
          </div>
        )}
      </section>

      {/* 7. FAQ SECTION */}
      <section className="py-16 sm:py-24 bg-gray-100 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 uppercase">Distributorship FAQ</h2>
            <div className="w-16 h-1 bg-red-600 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="space-y-4">
            <FaqItem question="Who can apply?" answer="Established electrical dealers, distributors, contractors, and relevant businesses looking to add a premium electrical range to their portfolio can apply." />
            <FaqItem question="What information is required?" answer="We require basic details about your business setup, exact location, KYC documents (Aadhaar & PAN), and the specific product categories you are interested in." />
            <FaqItem question="How is an application reviewed?" answer="Our team evaluates the application based on your location, market presence, and business experience. We may contact you for further details before final approval." />
            <FaqItem question="How will I be contacted?" answer="You will receive an automated email/WhatsApp notification once your application is reviewed. Our team will also call you directly on the provided mobile number." />
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="bg-[#111111] py-20 border-t-4 border-red-600 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 leading-tight">READY TO BUILD A PARTNERSHIP?</h2>
          <p className="text-gray-400 text-lg mb-10">Start your FLOREY distributorship application today and bring premium electrical solutions to your market.</p>
          <a href="#apply" className="inline-block bg-red-600 text-white font-extrabold px-10 py-4 rounded-full shadow-lg hover:bg-red-700 hover:-translate-y-1 transition-all text-lg">
            Apply Now &rarr;
          </a>
        </div>
      </section>

    </div>
  );
}

// ----- Reusable Components -----

function FeatureCard({ num, title, desc }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-red-200 hover:-translate-y-1 transition-all group">
      <div className="text-4xl font-black text-gray-100 mb-4 group-hover:text-red-100 transition-colors">{num}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function ProcessStep({ num, title, desc }) {
  return (
    <div className="relative text-center z-10">
      <div className="w-16 h-16 bg-gray-800 text-red-500 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6 border-4 border-gray-900 shadow-xl">
        {num}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm px-4">{desc}</p>
    </div>
  );
}

function FaqItem({ question, answer }) {
  return (
    <details className="group bg-white rounded-2xl border border-gray-200 open:shadow-md transition-all">
      <summary className="flex cursor-pointer list-none items-center justify-between p-6 font-bold text-gray-900">
        <span>{question}</span>
        <span className="transition group-open:rotate-180">
          <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
        </span>
      </summary>
      <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed">
        {answer}
      </div>
    </details>
  );
}