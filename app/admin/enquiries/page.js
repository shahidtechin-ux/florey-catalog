"use client";
import { useState, useEffect } from 'react';

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Page load hote hi backend se enquiries fetch karna
  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await fetch('/api/contact');
      const result = await response.json();
      if (result.success) {
        setEnquiries(result.data);
      }
    } catch (error) {
      console.error("Error fetching enquiries", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Date format function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <div className="p-6 md:p-10 w-full max-w-[1600px] mx-auto min-h-screen bg-[#f8f9fc] font-sans">
      
      {/* Premium Header Section */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle Background Gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-50 to-transparent rounded-full -mr-20 -mt-20 opacity-70 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-red-600 rounded-full"></div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Customer Enquiries</h1>
          </div>
          <p className="text-sm text-gray-500 font-medium pl-5">Manage all your product, catalogue, and distributorship leads.</p>
        </div>

        <div className="relative z-10 bg-gradient-to-br from-gray-900 to-black px-6 py-4 rounded-2xl shadow-xl flex items-center gap-5 border border-gray-800 transform hover:scale-105 transition-transform duration-300">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Total Leads</span>
            <span className="text-2xl font-black text-white leading-none">{enquiries.length}</span>
          </div>
          <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center text-red-500 shadow-inner">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="relative">
            <span className="absolute inset-0 rounded-full border-4 border-gray-100"></span>
            <span className="relative w-12 h-12 border-4 border-transparent border-t-red-600 rounded-full animate-spin block"></span>
          </div>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-6">Syncing Database...</p>
        </div>
      ) : enquiries.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">Inbox is Empty</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">Your latest customer messages, product queries, and distributorship applications will appear right here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#fcfcfd] border-b border-gray-100 text-[11px] uppercase tracking-[0.15em] text-gray-400">
                  <th className="px-6 py-5 font-bold w-[18%]">Ticket Info</th>
                  <th className="px-6 py-5 font-bold w-[22%]">Client Details</th>
                  <th className="px-6 py-5 font-bold w-[20%]">Enquiry Type</th>
                  <th className="px-6 py-5 font-bold w-[40%]">Message Content</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {enquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-[#fafbfc] transition-all duration-200 group">
                    
                    {/* Ticket Info */}
                    <td className="px-6 py-5 align-top">
                      <div className="inline-flex items-center gap-1.5 bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-md mb-2 shadow-sm">
                        <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                        {enq.referenceId}
                      </div>
                      <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {formatDate(enq.createdAt)}
                      </div>
                    </td>

                    {/* Client Details */}
                    <td className="px-6 py-5 align-top">
                      <div className="font-bold text-gray-900 text-sm mb-1.5 group-hover:text-red-600 transition-colors">{enq.fullName}</div>
                      <div className="text-xs text-gray-500 flex flex-col gap-1.5">
                        <a href={`tel:${enq.mobileNumber}`} className="flex items-center gap-2 hover:text-gray-900 transition-colors w-fit">
                          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></div> 
                          {enq.mobileNumber}
                        </a>
                        {enq.email && (
                          <a href={`mailto:${enq.email}`} className="flex items-center gap-2 hover:text-gray-900 transition-colors w-fit line-clamp-1">
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div> 
                            {enq.email}
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Enquiry Type */}
                    <td className="px-6 py-5 align-top">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                        enq.enquiryType === 'Distributorship' 
                          ? 'bg-purple-50 text-purple-700 border-purple-100' 
                          : enq.enquiryType === 'Product Enquiry'
                          ? 'bg-blue-50 text-blue-700 border-blue-100'
                          : 'bg-orange-50 text-orange-700 border-orange-100'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${enq.enquiryType === 'Distributorship' ? 'bg-purple-500' : enq.enquiryType === 'Product Enquiry' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                        {enq.enquiryType}
                      </span>
                      
                      {/* Conditional Tags */}
                      <div className="mt-3 space-y-1.5">
                        {enq.companyName && (
                          <div className="text-[11px] font-bold text-gray-700 flex items-start gap-1.5">
                            <svg className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> 
                            <span className="line-clamp-1">{enq.companyName}</span>
                          </div>
                        )}
                        {enq.cityState && (
                          <div className="text-[11px] text-gray-500 flex items-start gap-1.5">
                            <svg className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> 
                            <span className="line-clamp-1">{enq.cityState}</span>
                          </div>
                        )}
                        {enq.productDetails && (
                          <div className="text-[11px] text-gray-500 flex items-start gap-1.5">
                            <svg className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> 
                            <span className="line-clamp-1">{enq.productDetails}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Message Content */}
                    <td className="px-6 py-5 align-top">
                      <div className="text-[13px] text-gray-600 bg-white p-4 rounded-2xl border border-gray-100 leading-relaxed shadow-sm group-hover:border-red-100 group-hover:shadow-md transition-all">
                        {enq.subject && <span className="block font-black text-gray-900 mb-1.5 pb-1.5 border-b border-gray-50">{enq.subject}</span>}
                        {enq.message}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}