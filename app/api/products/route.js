import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Product from '../../../models/Product';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary Configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// GET: Fetch all products (Memory Crash Fixed)
export async function GET(request) {
  try {
    await connectToDatabase();
    // _id se sort karne par memory limit error nahi aata
    const products = await Product.find({}).sort({ _id: -1 });
    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST: Add new product with Cloudinary Images
export async function POST(request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    
    // 🟢 FIX 1: Agar frontend "image" (Singular) bhej raha hai
    if (body.image && typeof body.image === 'string' && body.image.startsWith('data:image')) {
       const uploadResponse = await cloudinary.uploader.upload(body.image, {
          folder: 'florey_products',
          transformation: [{ width: 1000, crop: "limit" }]
       });
       body.image = uploadResponse.secure_url;
    }

    // 🟢 FIX 2: Agar frontend "images" (Array) bhej raha hai
    if (body.images && Array.isArray(body.images)) {
       const imageUrls = [];
       for (const base64Image of body.images) {
          if (base64Image.startsWith('data:image')) {
             const uploadResponse = await cloudinary.uploader.upload(base64Image, {
                folder: 'florey_products',
                transformation: [{ width: 1000, crop: "limit" }]
             });
             imageUrls.push(uploadResponse.secure_url);
          } else {
             imageUrls.push(base64Image);
          }
       }
       body.images = imageUrls;
    }
    
    const newProduct = new Product(body);
    await newProduct.save();
    
    return NextResponse.json({ success: true, message: 'Product added successfully!' }, { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ success: false, message: 'Failed to add product' }, { status: 500 });
  }
}