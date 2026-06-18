import { connectToDB } from "@/utils/connectToDb";
import Membership from "@/utils/models/Membership";
import { NextRequest, NextResponse } from "next/server";
import Branches from "@/utils/models/Branches";
import { getToken } from "next-auth/jwt";

// Prevents Next.js from caching this route and causing 404s in production!
export const dynamic = 'force-dynamic'; 

export async function POST(req: NextRequest) {
  try {
    // 1. Get the token from the request
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    // Check if user is logged in
    if (!token || !token.sub) {
      return NextResponse.json({ error: "Unauthorized. Please log in again." }, { status: 401 });
    }

    const userId = token.sub;
    
    // Extract EXACTLY what the frontend is sending now (no city, no postalCode)
    const { name, category, address, state, country } = await req.json();

    if (!name || !address || !category || !state || !country) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDB();

    // 2. Create the Business
    const newBranch = await Branches.create({
      name,
      category,
      slug: name.toLowerCase().trim().replace(/\s+/g, '-'), 
      location: {
          address,
          state,
          country
      }
    });

    // 3. Create the Membership linking the user to the business
    await Membership.create({
      userId: userId,
      branchId: newBranch._id,
      role: 'owner' 
    });

    return NextResponse.json({ 
      branch : {
        slug: newBranch.slug
      },
      success: true, 
      message: "Business created and linked successfully!" 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Onboarding Error:", error);
    return NextResponse.json({ 
      error: error.code === 11000 ? "Business name already taken" : "Internal Server Error" 
    }, { status: 500 });  
  }
}