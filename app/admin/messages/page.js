"use client";
import { useState, useEffect } from 'react';

// Default templates database format ke sath
const defaultTemplates = [
  { id: 1, type: "approve", name: "Application Approved", subject: "Welcome to FLOREY - Distributorship Approved", content: "Hello {name},\n\nThank you for your interest in FLOREY Electricals.\n\nYour distributorship application has been approved. Our team will contact you shortly regarding the next steps.\n\nRegards,\nShajjad Electronics\nAuthorized Distributor of FLOREY" },
  { id: 2, type: "reject", name: "Application Rejected", subject: "Update on your FLOREY Application", content: "Hello {name},\n\nThank you for your interest in FLOREY Electricals.\n\nAfter reviewing your profile, we are unable to proceed with your distributorship application at this time.\n\nRegards,\nShajjad Electronics" },
  { id: 3, type: "received", name: "Application Received", subject: "Application Received - FLOREY", content: "Hello {name},\n\nWe have received your application for distributorship. Our team is currently reviewing your details and will get back to you within 48 hours.\n\nRegards,\nShajjad Electronics" },
];

// 🟢 NAYA: Delivery Logs tab ko yahan se hata diya hai
const tabs = ["Templates", "API Settings"];

export default function MessageCentrePage() {
  const [activeTab, setActiveTab] = useState("Templates");
  
  const [templates, setTemplates] = useState(defaultTemplates);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [editForm, setEditForm] = useState({ subject: "", content: "" });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      
      if (data.success && data.data.length > 0) {
        const updatedTemplates = defaultTemplates.map(defTemp => {
          const savedTemp = data.data.find(t => t.type === defTemp.type);
          if (savedTemp) {
            return { ...defTemp, subject: savedTemp.subject, content: savedTemp.body };
          }
          return defTemp;
        });
        setTemplates(updatedTemplates);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const handleEditClick = (template) => {
    setEditingTemplate(template);
    setEditForm({ subject: template.subject, content: template.content });
  };

  const handleSaveTemplate = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: editingTemplate.type,
          subject: editForm.subject,
          body: editForm.content 
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setTemplates(templates.map(t => 
          t.type === editingTemplate.type 
            ? { ...t, subject: editForm.subject, content: editForm.content } 
            : t
        ));
        alert("Template saved to Database successfully! ✅");
        setEditingTemplate(null);
      } else {
        alert("Failed to save template.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Kuch technical issue aaya hai.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Message Centre</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">Manage automated email and WhatsApp communications.</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setEditingTemplate(null); }}
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

      {/* TAB 1: TEMPLATES */}
      {activeTab === "Templates" && !editingTemplate && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl flex-1 mb-6 border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Subject</p>
                <p className="text-sm text-gray-900 font-medium mb-3 truncate">{template.subject}</p>
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Preview</p>
                <p className="text-sm text-gray-600 line-clamp-3 whitespace-pre-wrap">{template.content}</p>
              </div>

              <button 
                onClick={() => handleEditClick(template)}
                className="w-full bg-white border-2 border-gray-200 text-gray-900 font-bold py-2.5 rounded-xl hover:border-red-600 hover:text-red-600 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Edit Template
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TEMPLATE EDITOR */}
      {activeTab === "Templates" && editingTemplate && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div className="flex items-center gap-3">
              <button onClick={() => setEditingTemplate(null)} className="text-gray-500 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </button>
              <h2 className="text-lg font-bold text-gray-900">Editing: {editingTemplate.name}</h2>
            </div>
            <button 
              onClick={handleSaveTemplate} 
              disabled={isSaving}
              className="bg-red-600 text-white font-bold px-5 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6 max-w-3xl">
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm flex gap-3 items-start border border-blue-100">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p>You can use variables like <strong className="font-mono bg-blue-100 px-1 rounded">{`{name}`}</strong> or <strong className="font-mono bg-blue-100 px-1 rounded">{`{company}`}</strong> in your message. They will be automatically replaced with the applicant's details.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Subject</label>
              <input 
                type="text" 
                value={editForm.subject}
                onChange={(e) => setEditForm({...editForm, subject: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Message Body</label>
              <textarea 
                rows="10"
                value={editForm.content}
                onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 resize-y font-mono"
              ></textarea>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: API SETTINGS */}
      {activeTab === "API Settings" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-3xl">
          <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Communication API Connections</h3>
          
          <div className="space-y-6">
            <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center font-bold">N</div>
                <h4 className="font-bold text-gray-900">Nodemailer (Currently Active)</h4>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">SMTP Status</label>
                  <p className="text-sm font-bold text-green-600">Connected Securely via .env</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </div>
                <h4 className="font-bold text-gray-900">WhatsApp Business API (Future Integration)</h4>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">WhatsApp Phone Number ID</label>
                  <input type="text" placeholder="Pending Integration" disabled className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 font-mono cursor-not-allowed" />
                </div>
              </div>
            </div>

            <button disabled className="bg-gray-200 text-gray-400 font-bold px-6 py-3 rounded-xl shadow-none w-full sm:w-auto cursor-not-allowed">
              Settings Locked (Dev Mode)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}