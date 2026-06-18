import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import Branches from "@/utils/models/Branches";
import { connectToDB } from "@/utils/connectToDb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getCurrentBranch } from "@/lib/get-current-branch";
import { revalidatePath } from "next/cache";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ branchId: string }> }
) {
  const session: any = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in again." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const {
      name,
      description,
      urlSlug,
      phone,
      website,
      street,
      postalCode,
      country,
      instagram,
      x,
      tiktok,
    } = body;

    await connectToDB();

    const { branchId } = await params;

    if (!branchId) {
      return NextResponse.json(
        { error: "Branch ID is required" },
        { status: 400 }
      );
    }

    const updatedFields: Record<string, any> = {};

    // Standard fields
    if (name !== undefined) updatedFields.name = name;
    if (description !== undefined) updatedFields.description = description;
    if (urlSlug !== undefined) updatedFields.slug = urlSlug;
    if (phone !== undefined) updatedFields.phone = phone;
    if (website !== undefined) updatedFields.website = website;

    // Nested Schema Fields - dot notation is required by Mongoose for nested objects!
    if (street !== undefined) updatedFields["location.address"] = street;
    if (postalCode !== undefined) updatedFields["location.postalCode"] = postalCode;
    if (country !== undefined) updatedFields["location.country"] = country;

    if (instagram !== undefined) updatedFields["socials.instagram"] = instagram;
    if (x !== undefined) updatedFields["socials.x"] = x;
    if (tiktok !== undefined) updatedFields["socials.tiktok"] = tiktok;

    const branch = await Branches.findByIdAndUpdate(
      branchId,
      { $set: updatedFields },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!branch) {
      return NextResponse.json(
        { error: "Branch not found" },
        { status: 404 }
      );
    }

    revalidatePath('/', 'layout');

    return NextResponse.json(
      {
        success: true,
        message: "Business updated successfully",
        branch,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PATCH BRANCH ERROR:", error);

    return NextResponse.json(
      {
        error: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}