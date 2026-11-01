"use client";
import { useState, useEffect } from 'react';

const tabs = ["All", "New", "Under Review", "Approved", "Rejected"];

export default function DistributorsPage() {
  const [activeTab, setActiveTab] = useState("New");
  const [selectedApp, setSelectedApp] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false); 
  
  // Workflow Modal States
  const [workflowAction, setWorkflowAction] = useState(null); // 'approve', 'reject', 'info'
  const [messageText, setMessageText] = useState("");

  // Database se Asli Applications Fetch karna
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/distributorship');
      const data = await res.json();
      if (data.success) {
        setApplications(data.data);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Status Filter Logic
  const filteredApps = applications.filter(app => {
    if (activeTab === "All") return true;
    if (activeTab === "New") return app.status === "Pending"; // 'Pending' ko 'New' tab me dikhana hai
    return app.status === activeTab;
  });

  // Nayi applications ka count nikalne ke liye
  const newAppsCount = applications.filter(app => app.status === "Pending").length;

  // 🟢 NAYA: Sirf Email aur Status Update (WhatsApp hata diya)
  const handleStatusUpdate = async (newStatus) => {
    setIsUpdating(true);

    try {
      const res = await fetch('/api/distributorship', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: selectedApp._id, 
          status: newStatus,
          messageText: messageText, // Backend ko bhej rahe hain email karne ke liye
          email: selectedApp.email  // Kis email par bhejna hai
        })
      });
      const data = await res.json();
      
      if (data.success) {
        fetchApplications(); // Reload data
        setWorkflowAction(null);
        setSelectedApp(null);
        alert(`Success! Status updated to ${newStatus}. Email sent successfully.`);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("Kuch technical issue aaya hai.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Jab Approve ya Reject button par click ho
  const handleActionClick = (action) => {
    setWorkflowAction(action);
    if (action === 'approve') {
      setMessageText(`Hello ${selectedApp?.fullName || selectedApp?.companyName},\n\nThank you for your interest in FLOREY Electricals.\n\nYour distributorship application has been approved. Our team will contact you shortly regarding the next steps.\n\nRegards,\nShajjad Electronics\nAuthorized Distributor of FLOREY`);
    } else if (action === 'reject') {
      setMessageText(`Hello ${selectedApp?.fullName || selectedApp?.companyName},\n\nThank you for your interest in FLOREY Electricals.\n\nAfter reviewing your profile, we are unable to proceed with your distributorship application at this time.\n\nRegards,\nShajjad Electronics`);
    } else {
      setMessageText(`Hello ${selectedApp?.fullName || selectedApp?.companyName},\n\nWe are reviewing your application for FLOREY distributorship. Please provide us with [Enter Details Here].\n\nRegards,\nShajjad Electronics`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 relative pb-20">
      
      {/* Header */}
      {!selectedApp && (
        <>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Distributorship Applications</h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">Review and manage business partner applications.</p>
          </div>

          {/* Custom Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-200 hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-6 py-3 font-bold text-sm transition-all border-b-2 ${
                  activeTab === tab 
                    ? 'border-red-600 text-red-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab} {tab === "New" && newAppsCount > 0 && <span className="ml-1 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-[10px]">{newAppsCount}</span>}
              </button>
            ))}
          </div>

          {/* Applications List View */}
          <div className={filteredApps.length > 0 ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "w-full"}>
            {isLoading ? (
               <div className="text-center py-20 text-gray-500 font-bold w-full col-span-full">Loading Applications...</div>
            ) : filteredApps.length > 0 ? filteredApps.map((app) => (
              <div key={app._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
                
                {/* Status Indicator */}
                <div className={`absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 rounded-full ${
                  app.status === 'Pending' ? 'bg-blue-500' : app.status === 'Under Review' ? 'bg-yellow-500' : app.status === 'Approved' ? 'bg-green-500' : 'bg-red-500'
                } opacity-20`}></div>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{app.companyName}</h3>
                    <p className="text-sm text-gray-500">{app.fullName}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                     app.status === 'Pending' ? 'bg-blue-100 text-blue-700' :
                     app.status === 'Under Review' ? 'bg-yellow-100 text-yellow-700' :
                     app.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {app.status === 'Pending' ? 'NEW' : app.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {app.city}, {app.state}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    {app.businessType}
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedApp(app)}
                  className="w-full bg-gray-50 text-gray-900 font-bold py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  View Application
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 text-center bg-white rounded-2xl border border-gray-100 shadow-sm mt-4 col-span-full">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5 border-2 border-gray-100 shadow-inner">
                  <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Applications Found</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  When potential partners submit the distributorship form on your website, their applications will securely appear here.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* VIEW 2: APPLICATION DETAIL VIEW */}
      {selectedApp && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col animate-in slide-in-from-right-8 duration-300">
          
          {/* Header */}
          <div className="bg-gray-900 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 blur-[50px] rounded-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-1">
                <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-white mr-2 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <h2 className="text-2xl font-extrabold">{selectedApp.companyName}</h2>
                <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold">{selectedApp.status === 'Pending' ? 'NEW' : selectedApp.status}</span>
              </div>
              <p className="text-gray-400 text-sm ml-11">Application {selectedApp.applicationId} • Applied on {new Date(selectedApp.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Application Details */}
            <div className="lg:col-span-2 space-y-8">
              
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Applicant Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><p className="text-xs text-gray-500 mb-1">Full Name</p><p className="font-bold text-gray-900">{selectedApp.fullName}</p></div>
                  <div><p className="text-xs text-gray-500 mb-1">Company / Shop Name</p><p className="font-bold text-gray-900">{selectedApp.companyName}</p></div>
                  <div><p className="text-xs text-gray-500 mb-1">Mobile Number</p><p className="font-bold text-gray-900">{selectedApp.mobileNumber}</p></div>
                  <div><p className="text-xs text-gray-500 mb-1">Email Address</p><p className="font-bold text-gray-900">{selectedApp.email || 'N/A'}</p></div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Business Profile</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><p className="text-xs text-gray-500 mb-1">Business Type</p><p className="font-bold text-gray-900">{selectedApp.businessType}</p></div>
                  <div><p className="text-xs text-gray-500 mb-1">Experience</p><p className="font-bold text-gray-900">{selectedApp.experience}</p></div>
                  <div><p className="text-xs text-gray-500 mb-1">Location</p><p className="font-bold text-gray-900">{selectedApp.city}, {selectedApp.state} - {selectedApp.pincode}</p></div>
                  <div><p className="text-xs text-gray-500 mb-1">GST Number</p><p className="font-bold text-gray-900 text-red-600 bg-red-50 px-2 py-0.5 rounded inline-block">{selectedApp.gstNumber || 'Not Provided'}</p></div>
                  <div className="sm:col-span-2"><p className="text-xs text-gray-500 mb-1">Interested Categories</p><p className="font-bold text-gray-900">{selectedApp.interest}</p></div>
                </div>
              </div>

              {/* KYC Documents Section */}
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">KYC Documents</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Aadhaar Box */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                     <div className="flex justify-between items-center mb-3">
                       <p className="text-sm font-bold text-gray-900">Aadhaar Card</p>
                       <p className="text-xs font-mono text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded">{selectedApp.aadhaarNumber || 'N/A'}</p>
                     </div>
                     {selectedApp.aadhaarUrl ? (
                        <a href={selectedApp.aadhaarUrl} target="_blank" rel="noreferrer" className="block relative w-full h-32 group overflow-hidden rounded-xl border border-gray-300">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={selectedApp.aadhaarUrl} alt="Aadhaar" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">View Full Image</span>
                          </div>
                        </a>
                     ) : <div className="h-32 bg-gray-100 rounded-xl flex items-center justify-center text-xs text-gray-400 font-bold border border-dashed border-gray-300">No Image Uploaded</div>}
                  </div>

                  {/* PAN Box */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                     <div className="flex justify-between items-center mb-3">
                       <p className="text-sm font-bold text-gray-900">PAN Card</p>
                       <p className="text-xs font-mono text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded uppercase">{selectedApp.panNumber || 'N/A'}</p>
                     </div>
                     {selectedApp.panUrl ? (
                        <a href={selectedApp.panUrl} target="_blank" rel="noreferrer" className="block relative w-full h-32 group overflow-hidden rounded-xl border border-gray-300">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={selectedApp.panUrl} alt="PAN" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">View Full Image</span>
                          </div>
                        </a>
                     ) : <div className="h-32 bg-gray-100 rounded-xl flex items-center justify-center text-xs text-gray-400 font-bold border border-dashed border-gray-300">No Image Uploaded</div>}
                  </div>

                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Message</h4>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-gray-700 italic text-sm leading-relaxed">"{selectedApp.message || 'No additional message provided.'}"</p>
                </div>
              </div>
            </div>

            {/* Right: Actions (Decision Panel) */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 h-fit">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Decision Workflow</h4>
              <p className="text-xs text-gray-500 mb-6">Take action on this application. An automated email will be sent to the applicant based on your decision.</p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => handleActionClick('approve')}
                  disabled={selectedApp.status === 'Approved'}
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  {selectedApp.status === 'Approved' ? 'Approved' : 'Approve Distributorship'}
                </button>
                
                <button 
                  onClick={() => handleActionClick('reject')}
                  disabled={selectedApp.status === 'Rejected'}
                  className="w-full bg-red-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  {selectedApp.status === 'Rejected' ? 'Rejected' : 'Reject Application'}
                </button>
                
                <button 
                  onClick={() => handleActionClick('info')}
                  disabled={selectedApp.status === 'Under Review'}
                  className="w-full bg-white text-gray-900 font-bold py-3 rounded-xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  {selectedApp.status === 'Under Review' ? 'Under Review' : 'Mark Under Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PROFESSIONAL WORKFLOW */}
      {workflowAction && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className={`p-6 border-b ${workflowAction === 'approve' ? 'bg-green-50 border-green-100' : workflowAction === 'reject' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-200'}`}>
              <h3 className={`text-xl font-extrabold ${workflowAction === 'approve' ? 'text-green-800' : workflowAction === 'reject' ? 'text-red-800' : 'text-gray-900'}`}>
                {workflowAction === 'approve' ? 'Approve Application?' : workflowAction === 'reject' ? 'Reject Application?' : 'Request Information'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                You are about to {workflowAction} <strong>{selectedApp?.fullName}</strong>. Please review the message below before sending.
              </p>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Message Template (Editable)</label>
              <textarea 
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 resize-none font-mono"
              ></textarea>
              <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                This message will be sent securely via Email.
              </p>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                disabled={isUpdating}
                onClick={() => setWorkflowAction(null)}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                disabled={isUpdating}
                onClick={() => {
                  const newStatus = workflowAction === 'approve' ? 'Approved' : workflowAction === 'reject' ? 'Rejected' : 'Under Review';
                  handleStatusUpdate(newStatus);
                }}
                className={`px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-md transition-colors flex items-center gap-2 disabled:opacity-70 ${
                  workflowAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 
                  workflowAction === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-900 hover:bg-black'
                }`}
              >
                {isUpdating && <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                {workflowAction === 'approve' ? 'Approve & Send Email' : workflowAction === 'reject' ? 'Reject & Send Email' : 'Mark Review & Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}