"use client";
import { useState, useEffect } from 'react';

const categoriesList = [
  "Modular Switches",
  "Sockets & Accessories",
  "Dimmers & Regulators",
  "MCBs & Protection",
  "LED Lighting",
  "Electrical Accessories",
  "Wires & Cables",
  "PC/GEM/CRYSTAL Series"
];

export default function ProductsPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  
  const [editId, setEditId] = useState(null);

  // 🟢 NAYA: Search aur Category ko track karne ke liye states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const defaultForm = {
    name: '', code: '', category: '', series: 'Standard', originalPrice: '', price: '', 
    description: '', highlights: '', warranty: '10 Years Replacement', material: 'Fire Retardant Polycarbonate',
    voltage: '240V AC', color: 'Pure White', packaging: '10 Pcs / Box', images: [], isFeatured: false
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (formData.images.length + files.length > 4) {
      setMessage('Error: You can only upload a maximum of 4 images.');
      return;
    }

    const validFiles = files.filter(f => f.size <= 2 * 1024 * 1024);
    if(validFiles.length < files.length) {
       setMessage("Warning: Some images were skipped because they are larger than 2MB.");
    }

    Promise.all(validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    })).then(base64Array => {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...base64Array] }));
    });
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, index) => index !== indexToRemove) }));
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name || '',
      code: product.code || '',
      category: product.category || '',
      series: product.series || 'Standard',
      originalPrice: product.originalPrice || '',
      price: product.price || '',
      description: product.description || '',
      highlights: Array.isArray(product.highlights) ? product.highlights.join('\n') : (product.highlights || ''),
      warranty: product.warranty || '10 Years Replacement',
      material: product.material || 'Fire Retardant Polycarbonate',
      voltage: product.voltage || '240V AC',
      color: product.color || 'Pure White',
      packaging: product.packaging || '10 Pcs / Box',
      images: product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []),
      isFeatured: product.isFeatured || false
    });
    setEditId(product._id);
    setIsAdding(true);
    setMessage('');
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        alert('Product Deleted Successfully! 🗑️');
        fetchProducts(); 
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Failed to connect to server for deletion.');
    }
  };

  const resetForm = () => {
    setFormData(defaultForm);
    setEditId(null);
    setIsAdding(false);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code || !formData.category || !formData.price || formData.images.length === 0) {
      setMessage('Error: Please fill all required fields and upload at least 1 image.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    
    try {
      const productToSave = {
        ...formData,
        originalPrice: Number(formData.originalPrice),
        price: Number(formData.price)
      };

      if (editId) productToSave.id = editId;

      const method = editId ? 'PUT' : 'POST';

      const res = await fetch('/api/products', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productToSave)
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage(editId ? 'Success: Product Updated Successfully! ✏️' : 'Success: Product Published Successfully! 🎉');
        
        setTimeout(() => {
          resetForm();
          fetchProducts();
        }, 1500);
      } else {
        setMessage('Error: ' + data.message);
      }
    } catch (error) {
      setMessage('Error: Failed to connect to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🟢 NAYA: Search aur Category ke basis par products filter karna
  const filteredProducts = products.filter((product) => {
    const searchMatch = 
      (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.code && product.code.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const categoryMatch = 
      selectedCategory === "All Categories" || product.category === selectedCategory;

    return searchMatch && categoryMatch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
      
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {isAdding ? (editId ? "Edit Product" : "Add New Product") : "Product Management"}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            {isAdding ? "Enter product details, specifications and upload up to 4 images." : "Manage your website products, categories and series."}
          </p>
        </div>
        
        {/* Toggle Button */}
        {isAdding ? (
          <button onClick={resetForm} className="bg-white border border-gray-300 text-gray-700 font-bold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Products
          </button>
        ) : (
          <button onClick={() => setIsAdding(true)} className="bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            Add New Product
          </button>
        )}
      </div>

      {/* VIEW 1: PRODUCT LIST */}
      {!isAdding && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            
            {/* 🟢 Search Input - Connected to State */}
            <div className="relative w-full sm:w-72">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            
            {/* 🟢 Category Dropdown - Connected to State */}
            <div className="flex gap-2 w-full sm:w-auto">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full sm:w-auto p-2 outline-none"
              >
                <option value="All Categories">All Categories</option>
                {categoriesList.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="p-16 text-center text-gray-500 font-medium">Loading products...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Product Name</th>
                    <th className="px-6 py-4 font-semibold">Code / Series</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Price</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {/* 🟢 Render 'filteredProducts' instead of 'products' */}
                  {filteredProducts.map((product) => (
                     <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                                 {/* eslint-disable-next-line @next/next/no-img-element */}
                                 <img src={product.images && product.images.length > 0 ? product.images[0] : (product.image || 'https://via.placeholder.com/40')} alt="" className="w-full h-full object-cover" />
                              </div>
                              <span className="font-bold text-gray-900">{product.name}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                           <div className="font-mono text-xs">{product.code}</div>
                           <div className="text-[10px] uppercase">{product.series}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                        <td className="px-6 py-4">
                           <span className="font-bold text-gray-900 block">₹{product.price}</span>
                           {product.originalPrice && <span className="text-[10px] text-gray-400 line-through">₹{product.originalPrice}</span>}
                        </td>
                        
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-4">
                              <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 text-xs font-bold transition-colors flex items-center gap-1">
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                 Edit
                              </button>
                              <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-800 text-xs font-bold transition-colors flex items-center gap-1">
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                 Delete
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5 border-2 border-gray-100 shadow-inner">
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {products.length === 0 ? "No Products Added Yet" : "No Matches Found"}
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mb-6">
                {products.length === 0 
                  ? "Your catalogue is currently empty. Start building your portfolio." 
                  : "We couldn't find any products matching your search or category filter."}
              </p>
              {products.length === 0 && (
                <button onClick={() => setIsAdding(true)} className="bg-red-600 text-white font-bold px-6 py-2.5 rounded-full shadow-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm">
                  Add Your First Product
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: ADD / EDIT PRODUCT FORM */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            {message && (
               <div className={`p-4 rounded-xl font-bold text-sm ${message.startsWith('Error') || message.startsWith('Warning') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                  {message}
               </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Basic Information</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Product Name <span className="text-red-500">*</span></label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Product Code / SKU <span className="text-red-500">*</span></label>
                    <input type="text" name="code" value={formData.code} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                    <select name="category" value={formData.category} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all text-gray-700">
                      <option value="">Select Category</option>
                      {categoriesList.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
               <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Content & Specifications</h3>
               <div className="space-y-5">
                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1.5">Product Highlights</label>
                   <textarea name="highlights" value={formData.highlights} onChange={handleInputChange} rows="3" placeholder="Bullet points separated by newline..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-red-600/20 focus:border-red-600 transition-all outline-none resize-none"></textarea>
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Description</label>
                   <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-red-600/20 focus:border-red-600 transition-all outline-none resize-none"></textarea>
                 </div>

                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                    <div>
                       <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Warranty</label>
                       <input type="text" name="warranty" value={formData.warranty} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-red-600" />
                    </div>
                    <div>
                       <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Material</label>
                       <input type="text" name="material" value={formData.material} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-red-600" />
                    </div>
                    <div>
                       <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Voltage</label>
                       <input type="text" name="voltage" value={formData.voltage} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-red-600" />
                    </div>
                    <div>
                       <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Color</label>
                       <input type="text" name="color" value={formData.color} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-red-600" />
                    </div>
                    <div>
                       <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Packaging</label>
                       <input type="text" name="packaging" value={formData.packaging} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-red-600" />
                    </div>
                 </div>
               </div>
            </div>

          </div>

          <div className="space-y-6">
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-100 pb-4">Product Images <span className="text-red-500">*</span></h3>
              <p className="text-[10px] text-gray-500 mb-4 uppercase tracking-wider">Upload up to 4 images.</p>
              
              <div className="relative border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 p-6 flex flex-col items-center justify-center text-center hover:bg-gray-100 hover:border-red-400 transition-colors cursor-pointer group min-h-[140px]">
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={formData.images.length >= 4} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                <svg className="w-6 h-6 text-gray-400 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                <p className="text-sm font-bold text-gray-700">Add Images ({formData.images.length}/4)</p>
                <p className="text-[10px] text-gray-500 mt-1">PNG, JPG (Max 2MB each)</p>
              </div>

              {formData.images.length > 0 && (
                 <div className="grid grid-cols-2 gap-2 mt-4">
                    {formData.images.map((imgSrc, index) => (
                       <div key={index} className="relative aspect-square border border-gray-200 rounded-lg overflow-hidden group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imgSrc} alt={`upload-${index}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                          {index === 0 && <span className="absolute bottom-0 left-0 right-0 bg-gray-900/80 text-white text-[8px] text-center font-bold py-1 z-10">MAIN IMAGE</span>}
                       </div>
                    ))}
                 </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Pricing & Publishing</h3>
              <div className="space-y-6">
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">MRP (Cut Price)</label>
                      <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} placeholder="e.g. 200" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all" />
                   </div>
                   <div>
                      <label className="block text-[11px] font-bold text-red-600 uppercase tracking-wider mb-1.5">Selling Price <span className="text-red-500">*</span></label>
                      <input type="number" name="price" value={formData.price} onChange={handleInputChange} required placeholder="e.g. 150" className="w-full px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all" />
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Product Series</label>
                  <select name="series" value={formData.series} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all text-gray-700">
                    <option value="Standard">Standard</option>
                    <option value="Gold">Gold Series</option>
                    <option value="PC">PC Series</option>
                    <option value="Crystal">Crystal Series</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between mt-4">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Featured Product</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">Show on homepage featured</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="pt-2 flex flex-col gap-3">
                  <button type="submit" disabled={isSubmitting} className="w-full bg-gray-900 text-white font-bold px-4 py-3.5 rounded-xl shadow-md hover:bg-black transition-colors text-sm disabled:opacity-50">
                    {isSubmitting ? (editId ? 'Updating...' : 'Publishing...') : (editId ? 'Update Product' : 'Publish Product')}
                  </button>
                  <button type="button" onClick={resetForm} className="w-full bg-white border border-gray-300 text-gray-700 font-bold px-4 py-3.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            </div>

          </div>
        </form>
      )}

    </div>
  );
}