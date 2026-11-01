import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import Product from '../../../../models/Product';

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    
    // 🟢 NAYA FIX: API route mein bhi params ko await karna zaroori hai
    const { id } = await params;
    
    // URL se ID nikal kar database mein dhoondna
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    console.error('Error fetching single product:', error);
    return NextResponse.json({ success: false, message: 'Error fetching product' }, { status: 500 });
  }
}