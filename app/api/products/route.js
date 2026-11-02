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

// GET: Fetch all products
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
    
    // FIX 1: Agar frontend "image" (Singular) bhej raha hai
    if (body.image && typeof body.image === 'string' && body.image.startsWith('data:image')) {
       const uploadResponse = await cloudinary.uploader.upload(body.image, {
          folder: 'florey_products',
          transformation: [{ width: 1000, crop: "limit" }]
       });
       body.image = uploadResponse.secure_url;
    }

    // FIX 2: Agar frontend "images" (Array) bhej raha hai
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
             imageUrls.push(base64Image); // Pehle se uploaded URL
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

// 🟢 NEW: PUT Method to Update existing product (Fix for "Edit" feature)
export async function PUT(request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    
    const productId = body.id;
    if (!productId) {
      return NextResponse.json({ success: false, message: 'Product ID is missing' }, { status: 400 });
    }

    // Naye images upload karna agar user ne edit ke waqt naye daale hain
    if (body.images && Array.isArray(body.images)) {
       const imageUrls = [];
       for (const imageItem of body.images) {
          if (imageItem.startsWith('data:image')) {
             const uploadResponse = await cloudinary.uploader.upload(imageItem, {
                folder: 'florey_products',
                transformation: [{ width: 1000, crop: "limit" }]
             });
             imageUrls.push(uploadResponse.secure_url);
          } else {
             imageUrls.push(imageItem); // Purani existing URL rehne do
          }
       }
       body.images = imageUrls;
    }

    // Database mein product update karo
    const updatedProduct = await Product.findByIdAndUpdate(
      productId, 
      body, 
      { new: true } // Update hone ke baad naya data return karega
    );

    if (!updatedProduct) {
       return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Product updated successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, message: 'Failed to update product' }, { status: 500 });
  }
}

// 🟢 NEW: DELETE Method to remove product (Fix for "Delete" feature)
export async function DELETE(request) {
  try {
    // Next.js mein URL parameter extract karna (Jaise /api/products?id=123)
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json({ success: false, message: 'Product ID is required for deletion' }, { status: 400 });
    }

    await connectToDatabase();
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
       return NextResponse.json({ success: false, message: 'Product not found or already deleted' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Product deleted successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete product' }, { status: 500 });
  }
}