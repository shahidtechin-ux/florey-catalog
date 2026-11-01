import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  category: { type: String, required: true },
  series: { type: String },
  
  // Pricing
  originalPrice: { type: Number, required: true }, // MRP (Jo cut hoga)
  price: { type: Number, required: true },         // Discounted Selling Price
  
  // Multiple Images (Array of strings)
  images: { type: [String], required: true },      // Ab yahan 1 se zyada images aayengi
  
  // Details
  description: { type: String },
  highlights: { type: String },                    // Bullet points (Line by line)
  
  // Technical Specs
  warranty: { type: String, default: '10 Years Replacement' },
  material: { type: String, default: 'Fire Retardant Polycarbonate' },
  voltage: { type: String, default: '240V AC' },
  color: { type: String, default: 'Pure White' },
  packaging: { type: String, default: '10 Pcs / Box' },
  
  // Badges
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', productSchema);