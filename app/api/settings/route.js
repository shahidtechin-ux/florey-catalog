import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Setting from '@/models/Setting';

export async function GET() {
  try {
    await connectMongo();
    // Humesha pehla document fetch karenge kyunki settings ek hi hoti hai
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({
        adminEmail: "floreyflorey11@gmail.com",
        adminPassword: "florey@123"
      }); // Agar database khali hai to default credentials ke sath bana dega
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("GET settings error:", error);
    return NextResponse.json({ success: false, message: "Error fetching settings" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectMongo();
    const body = await req.json();
    
    // Object prepare kar rahe hain taaki ensure ho ki email aur password sahi field mein jayein
    const updateData = {};
    if (body.adminEmail) updateData.adminEmail = body.adminEmail;
    
    // Agar naya password bheja gaya hai tabhi usko update list mein daalo
    if (body.newPassword) {
      updateData.adminPassword = body.newPassword;
    }
    
    // Agar maintenance mode bhi hai to use bhi le lo
    if (typeof body.maintenanceMode === 'boolean') {
      updateData.maintenanceMode = body.maintenanceMode;
    }

    // Database mein update ya create karna
    const settings = await Setting.findOneAndUpdate(
      {}, 
      { $set: updateData }, 
      { new: true, upsert: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: "Credentials and settings saved successfully!", 
      data: settings 
    });
  } catch (error) {
    console.error("PUT settings error:", error);
    return NextResponse.json({ success: false, message: "Error updating settings" }, { status: 500 });
  }
}