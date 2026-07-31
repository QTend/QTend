import { connectToDB } from "@/utils/connectToDb";
import Membership from "@/utils/models/Membership";
import { NextRequest, NextResponse } from "next/server";
import Branches from "@/utils/models/Branches";
import { getToken } from "next-auth/jwt";
import { welcomeEmail } from "@/lib/sendEmails/welcomeEmail";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth";

// Prevents Next.js from caching this route and causing 404s in production!
export const dynamic = 'force-dynamic'; 

export async function POST(req: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session?.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

  
    
    // Extract EXACTLY what the frontend is sending now (no city, no postalCode)
    const { name, categories, address, state, country } = await req.json();

    if (!name || !address || !categories || categories.length === 0 || !state || !country) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDB();

    // 2. Create the Business
    const newBranch = await Branches.create({
      name,
      categories,
      slug: name.toLowerCase().trim().replace(/\s+/g, '-'), 
      location: {
          address,
          state,
          country
      }
    });

    // 3. Create the Membership linking the user to the business
    await Membership.create({
      userId: session?.user.id,
      branchId: newBranch._id,
      role: 'owner' 
    });

    try {
      await welcomeEmail({
        branchName: newBranch.name,
        email: session?.user.email
      });
    } catch (emailError) {
      // Log the error but don't crash onboarding if the mail server drops frames
      console.error("Welcome email failed to send, but onboarding succeeded:", emailError);
    }

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