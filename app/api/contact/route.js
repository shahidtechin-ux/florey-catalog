import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Enquiry from '../../../models/Enquiry';

export async function POST(request) {
  try {
    // 1. Frontend se bheja gaya data receive karna
    const body = await request.json();

    // 2. Database se connect karna
    await connectToDatabase();

    // 3. Naya data database model mein dalna
    const newEnquiry = new Enquiry(body);

    // 4. Data ko save karna
    await newEnquiry.save();

    // 5. Success message wapas bhejna
    return NextResponse.json(
      { success: true, message: 'Enquiry submitted successfully!' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Backend Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit enquiry. Please try again later.' },
      { status: 500 }
    );
  }
}

// Ye naya function database se saari enquiries nikal kar admin ko dega
export async function GET() {
  try {
    await connectToDatabase();
    
    // Sort by createdAt: -1 (Nayi enquiry sabse upar aayegi)
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(
      { success: true, data: enquiries },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch enquiries:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch enquiries.' },
      { status: 500 }
    );
  }
}