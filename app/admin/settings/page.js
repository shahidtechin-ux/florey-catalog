"use client";
import { useState, useEffect } from 'react';

const tabs = ["Business Profile", "Admin Account", "System & Security"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Business Profile");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Database Fields State
  const [settings, setSettings] = useState({
    brandName: "FLOREY",
    companyName: "Shajjad Electronics",
    officialEmail: "info@shajjadelectronics.com",
    supportPhone: "+91 98765 43210",
    officeAddress: "Bhagirath Palace, Chandni Chowk, New Delhi, 110006",
    gstin: "",
    adminName: "Admin User",
    adminEmail: "floreyflorey11@gmail.com",
    acceptDistributors: true,
    maintenanceMode: false
  });

  // Password Fields State
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  // 🟢 Password Show/Hide Toggle States (Eye Icon States)
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Load Settings from Database
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.data) {
        setSettings(prev => ({ 
          ...prev, 
          ...data.data,
          adminEmail: data.data.adminEmail || prev.adminEmail 
        }));
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Password Update Validation
    if (passwords.new || passwords.current) {
      if (passwords.new !== passwords.confirm) {
        alert("New passwords do not match!");
        setIsSaving(false);
        return;
      }
    }

    try {
      // API payload tayyar kar rahe hain
      const payload = {
        ...settings,
        adminEmail: settings.adminEmail,
        newPassword: passwords.new ? passwords.new : undefined
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        alert("Settings & Credentials saved successfully to Database! ✅");
        setPasswords({ current: "", new: "", confirm: "" }); // Clear password fields
      } else {
        alert("Failed to save settings.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Kuch technical issue aaya hai.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="text-gray-500 font-bold p-10 text-center flex flex-col items-center"><svg className="animate-spin h-8 w-8 text-red-500 mb-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Loading Settings...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Settings</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Manage your business profile, admin access, and security.</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-red-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm disabled:opacity-70"
        >
          {isSaving ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Tabs */}
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
            {tab}
          </button>
        ))}
      </div>

      <div className="max-w-4xl">
        {/* TAB 1: BUSINESS PROFILE */}
        {activeTab === "Business Profile" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Company Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Brand Name</label>
                  <input type="text" name="brandName" value={settings.brandName} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Company Name</label>
                  <input type="text" name="companyName" value={settings.companyName} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Official Email</label>
                  <input type="email" name="officialEmail" value={settings.officialEmail} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Support Phone Number</label>
                  <input type="text" name="supportPhone" value={settings.supportPhone} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Office Address</label>
                  <textarea rows="3" name="officeAddress" value={settings.officeAddress} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 resize-none"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">GSTIN (Optional)</label>
                  <input type="text" name="gstin" value={settings.gstin} onChange={handleChange} placeholder="Enter GST Number" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 font-mono" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ADMIN ACCOUNT */}
        {activeTab === "Admin Account" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Profile & Login Credentials</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
                  <input type="text" name="adminName" value={settings.adminName} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Admin Email (Login ID)</label>
                  <input type="email" name="adminEmail" value={settings.adminEmail} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Change Password</h3>
              <div className="grid grid-cols-1 gap-6 sm:w-2/3">
                
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Current Password</label>
                  <div className="relative">
                    <input 
                      type={showCurrent ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={passwords.current} 
                      onChange={(e) => setPasswords({...passwords, current: e.target.value})} 
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 pr-12" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold uppercase"
                    >
                      {showCurrent ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">New Password</label>
                  <div className="relative">
                    <input 
                      type={showNew ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={passwords.new} 
                      onChange={(e) => setPasswords({...passwords, new: e.target.value})} 
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 pr-12" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold uppercase"
                    >
                      {showNew ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Confirm New Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirm ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={passwords.confirm} 
                      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} 
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 pr-12" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold uppercase"
                    >
                      {showConfirm ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SYSTEM & SECURITY */}
        {activeTab === "System & Security" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Website Controls</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Accept New Distributors</p>
                    <p className="text-xs text-gray-500 mt-1">Allow people to submit distributorship forms on the website.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="acceptDistributors" checked={settings.acceptDistributors} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Maintenance Mode</p>
                    <p className="text-xs text-gray-500 mt-1">Temporarily hide the website from visitors. Only admins can view it.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}