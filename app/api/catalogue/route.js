// app/api/catalogue/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Catalogue from '../../../models/Catalogue';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary Setup
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export async function GET() {
  try {
    await connectToDatabase();
    const catalogue = await Catalogue.findOne();
    return NextResponse.json({ success: true, data: catalogue }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    
    let { title, edition, pdfData, coverData, existingPdfUrl, existingCoverUrl } = body;
    
    let finalPdfUrl = existingPdfUrl;
    let finalCoverUrl = existingCoverUrl;

    // Naya PDF Cloudinary par bhejna
    if (pdfData && pdfData.startsWith('data:')) {
       const pdfUpload = await cloudinary.uploader.upload(pdfData, {
          folder: 'florey_catalogue',
          resource_type: 'auto' // PDF ke liye 'auto' zaruri hai
       });
       finalPdfUrl = pdfUpload.secure_url;
    }

    // Nayi Photo Cloudinary par bhejna
    if (coverData && coverData.startsWith('data:image')) {
       const coverUpload = await cloudinary.uploader.upload(coverData, {
          folder: 'florey_catalogue',
          transformation: [{ width: 800, crop: "limit" }]
       });
       finalCoverUrl = coverUpload.secure_url;
    }
    
    // Database me update karna
    let catalogue = await Catalogue.findOne();
    if (catalogue) {
        catalogue.title = title;
        catalogue.edition = edition;
        catalogue.pdfUrl = finalPdfUrl;
        catalogue.coverImage = finalCoverUrl;
        await catalogue.save();
    } else {
        catalogue = new Catalogue({ title, edition, pdfUrl: finalPdfUrl, coverImage: finalCoverUrl });
        await catalogue.save();
    }
    
    return NextResponse.json({ success: true, message: 'Catalogue Updated Successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update catalogue' }, { status: 500 });
  }
}