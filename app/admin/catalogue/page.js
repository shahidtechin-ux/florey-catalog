// app/admin/catalogue/page.js
"use client";
import { useState, useEffect } from 'react';

export default function CatalogueCMS() {
  const [formData, setFormData] = useState({ title: '', edition: '', pdfUrl: '', coverImage: '' });
  const [pdfData, setPdfData] = useState(null);
  const [coverData, setCoverData] = useState(null);
  const [pdfName, setPdfName] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Page load hote hi current catalogue lana
  useEffect(() => {
    const fetchCatalogue = async () => {
      try {
        const res = await fetch('/api/catalogue');
        const data = await res.json();
        if (data.success && data.data) {
          setFormData({
            title: data.data.title || '',
            edition: data.data.edition || '',
            pdfUrl: data.data.pdfUrl || '',
            coverImage: data.data.coverImage || ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCatalogue();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 🟢 FIX: 5MB se badha kar 20MB kar diya gaya hai
      if (file.size > 20 * 1024 * 1024) { 
         setMessage("Error: PDF should be less than 20MB");
         return;
      }
      setPdfName(file.name);
      setMessage(''); // Clear previous errors
      const reader = new FileReader();
      reader.onloadend = () => setPdfData(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverData(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('Uploading... Please wait, 15MB file might take a few seconds to upload to Cloudinary. ⏳');
    
    try {
      const res = await fetch('/api/catalogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          edition: formData.edition,
          pdfData: pdfData,
          coverData: coverData,
          existingPdfUrl: formData.pdfUrl,
          existingCoverUrl: formData.coverImage
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage('Success: Catalogue updated perfectly! 🎉');
        setPdfData(null);
        setCoverData(null);
        setPdfName('');
      } else {
        setMessage('Error: ' + data.message);
      }
    } catch (err) {
      setMessage('Error: Failed to connect to server. If file is too large, it might timeout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-white text-center py-20">Loading Catalogue Data...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Catalogue CMS</h1>
        <p className="text-gray-400 mt-1">Manage your official website PDF catalogue and cover image.</p>
      </div>

      {message && (
         <div className={`p-4 rounded-xl font-bold text-sm ${message.startsWith('Error') ? 'bg-red-900/50 text-red-400 border border-red-800' : (message.startsWith('Uploading') ? 'bg-blue-900/50 text-blue-400 border border-blue-800' : 'bg-green-900/50 text-green-400 border border-green-800')}`}>
            {message}
         </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Inputs & PDF */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 shadow-xl">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-bold text-gray-400 mb-2">Catalogue Title</label>
                   <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 transition-colors" placeholder="e.g. Complete Electrical Solutions" />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-400 mb-2">Edition / Year</label>
                   <input type="text" name="edition" value={formData.edition} onChange={handleInputChange} required className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 transition-colors" placeholder="e.g. 2026 - 2027 Edition" />
                </div>
             </div>
          </div>

          <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 shadow-xl">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-200">PDF Document</h3>
                {formData.pdfUrl && <span className="bg-green-900/30 text-green-500 border border-green-800 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">Currently Active</span>}
             </div>
             
             <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center relative hover:bg-[#1a1a1a] transition-colors group cursor-pointer">
                <input type="file" accept=".pdf" onChange={handlePdfUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <svg className="w-10 h-10 text-gray-500 mb-3 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                <p className="text-sm font-bold text-gray-300">{pdfName ? `Ready to upload: ${pdfName}` : 'Upload New Catalogue PDF'}</p>
                <p className="text-[11px] text-gray-500 mt-1">Max file size: 20MB</p>
             </div>

             {formData.pdfUrl && !pdfData && (
                <div className="mt-4 flex items-center justify-between bg-[#1a1a1a] border border-gray-700 p-4 rounded-lg">
                   <div className="flex items-center gap-3">
                      <div className="bg-red-600/20 p-2 rounded">
                         <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M11.362 2c4.156 0 2.638 6 2.638 6s6-1.65 6 2.457v11.543h-16v-20h7.362zm.827-2h-10.189v24h20v-14.386c0-2.391-6.648-9.614-9.811-9.614zm-4.189 12.029l.342-.045c.87-.113 2.016-.369 3.064-.991.603-1.666.973-2.909 1.157-3.864-.108-.246-.17-.552-.17-.866 0-.847.452-1.35.892-1.35.344 0 .61.229.61.884 0 1.258-1.077 3.39-1.996 4.795.83.69 1.77 1.341 2.802 1.931 1.096.096 2.062.247 2.459.711.373.435.158 1.166-.356 1.166-.339 0-.909-.327-1.745-.968-1.572-.375-3.237-.624-4.887-.732-1.616 1.487-3.082 2.115-4.14 2.115-.461 0-.923-.197-.923-.745 0-.756.971-1.662 2.891-2.041zm.268.966c-.672.23-1.066.697-1.066 1.054 0 .151.057.266.166.266.363 0 1.251-.624 2.148-1.554-.424.088-.847.166-1.248.234zm6.657-1.393c.174 0 .285-.067.285-.181 0-.251-.433-.362-.976-.362-.257 0-.53.023-.805.059.458.329.98.484 1.496.484zm-3.003-8.082c-.198 0-.312.193-.312.603 0 .341.058.692.146 1.042.443-.912.166-1.645-.166-1.645zm-1.127 7.02c1.472.083 2.94.298 4.316.621-1.011-.531-1.89-1.127-2.618-1.745-1.168 1.439-2.31 3.298-2.656 4.382.476-.704 1.013-1.684 1.517-2.73-1.163-.122-2.34-.143-3.52-.061 1.052-.162 2.05-.333 2.961-.467z"/></svg>
                      </div>
                      <div>
                         <p className="text-sm font-bold text-gray-200">Current Catalogue</p>
                         <p className="text-[10px] text-gray-500">Live on website</p>
                      </div>
                   </div>
                   <a href={formData.pdfUrl} target="_blank" rel="noreferrer" className="text-red-500 text-xs font-bold hover:underline">View PDF &rarr;</a>
                </div>
             )}
          </div>
        </div>

        {/* Right Side: Cover Image */}
        <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 shadow-xl">
           <h3 className="font-bold text-gray-200 mb-4">Cover Image</h3>
           <div className="relative aspect-[1/1.4] bg-[#1a1a1a] rounded-xl border border-gray-700 overflow-hidden mb-4 group">
              {coverData || formData.coverImage ? (
                 // eslint-disable-next-line @next/next/no-img-element
                 <img src={coverData || formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">No Cover Image</div>
              )}
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                 <span className="text-white font-bold text-sm bg-red-600 px-4 py-2 rounded-full">Change Image</span>
                 <input type="file" accept="image/*" onChange={handleCoverUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
           </div>
           <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest">Recommended ratio: A4 Portrait</p>
        </div>

        <div className="lg:col-span-3">
           <button type="submit" disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-lg py-4 rounded-xl shadow-lg transition-colors disabled:opacity-50">
             {isSubmitting ? 'Uploading Please Wait...' : 'Save & Publish Catalogue'}
           </button>
        </div>

      </form>
    </div>
  );
}