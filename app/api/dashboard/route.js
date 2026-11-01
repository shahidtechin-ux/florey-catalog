import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Distributor from '@/models/Distributor';
import Product from '@/models/Product';
import Enquiry from '@/models/Enquiry';

export async function GET() {
  try {
    await connectMongo();

    // 1. Pending Applications Count nikalna
    const pendingAppsCount = await Distributor.countDocuments({ status: 'Pending' }).catch(() => 0);

    // 2. Recent 5 Applications nikalna (Sabse nayi pehle)
    const recentApps = await Distributor.find().sort({ createdAt: -1 }).limit(5).catch(() => []);

    // 3. Total Products Count (Agar model ready nahi hai toh error catch karke 0 dega)
    const totalProducts = await Product.countDocuments().catch(() => 0);

    // 4. Total Categories (Product model me se unique categories ginna)
    let totalCategories = 0;
    try {
        const categories = await Product.distinct('category');
        totalCategories = categories.length;
    } catch (e) {
        totalCategories = 0;
    }

    // 5. Total Enquiries Count
    const newEnquiriesCount = await Enquiry.countDocuments().catch(() => 0);

    return NextResponse.json({
      success: true,
      data: {
        pendingApps: pendingAppsCount,
        recentApps,
        totalProducts,
        totalCategories,
        newEnquiries: newEnquiriesCount
      }
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}