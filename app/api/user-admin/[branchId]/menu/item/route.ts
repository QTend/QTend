import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/utils/connectToDb";
import MenuItem from "@/utils/models/MenuItem"; 
import Branch from "@/utils/models/Branches"; // 🚀 NEW: Import Branch for billing checks
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import MenuCategory from "@/utils/models/MenuCategory";
import Zone from "@/utils/models/Zone";
import { deleteCloudinaryImage } from "@/utils/cloudinary";

type RouteParams = {
    params: Promise<{ branchId: string }>
}

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session?.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        await connectToDB();
        const { branchId } = await params;

        if (!branchId) {
            return NextResponse.json({ error: "Branch ID parameter missing" }, { status: 400 });
        }
        
        const categoryId = req.nextUrl.searchParams.get("categoryId");
        const q = req.nextUrl.searchParams.get('q');

        const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10);
        const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10', 10);
        const skip = (page - 1) * limit;

        const query: any = { branchId };
        
        if (categoryId) {
            query.categoryId = categoryId; 
        }

        if (q) {
            query.name = { $regex: q, $options: "i" }; 
        }

        // 🚀 NEW: Fetch absolute total for billing concurrently with pagination data
        const [items, filteredTotal, absoluteTotalItems] = await Promise.all([
            MenuItem.find(query)
                .populate('categoryId', 'name _id')
                .populate('zoneId', 'name _id')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            MenuItem.countDocuments(query),               // For Pagination pages
            MenuItem.countDocuments({ branchId })         // For Billing Limits
        ]);

        const totalPages = Math.ceil(filteredTotal / limit);

        return NextResponse.json({ 
            items, 
            totalPages, 
            currentPage: page,
            totalItems: absoluteTotalItems // 🚀 NEW: Sent to frontend for limit checking
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching items:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session?.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDB();
        const { branchId } = await params;
        
        const categoryId = req.nextUrl.searchParams.get("categoryId");
        
        const body = await req.json();
        const { items } = body; 

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "No items provided" }, { status: 400 });
        }

        // 🚀 NEW: Billing Guard Check
        const branch = await Branch.findById(branchId);
        if (!branch) {
            return NextResponse.json({ error: "Branch not found" }, { status: 404 });
        }

        // Limit Check (Basic Tier: Max 15 items)
        const isBasicPlan = !branch.plans?.planType || branch.plans.planType === 'basic';
        
        if (isBasicPlan) {
            const currentItemCount = await MenuItem.countDocuments({ branchId });
            
            if (currentItemCount + items.length > 15) {
                return NextResponse.json(
                    { 
                        error: `Basic plan limit reached. You have ${currentItemCount} item(s). Adding ${items.length} more exceeds the 15-item limit. Upgrade to Starter for unlimited items.`,
                        code: "UPGRADE_REQUIRED",
                        limit: 15,
                        currentCount: currentItemCount
                    }, 
                    { status: 403 }
                );
            }
        }

        // Check all items BEFORE processing
        for (const item of items) {
            if (!item.zoneId) {
                return NextResponse.json({ error: "Every item must be assigned to a zone." }, { status: 400 });
            }
        }

        // Map over the items to attach the branch, category, and a dummy typeId
        const itemsToSave = items.map((item: any) => ({
            ...item,
            branchId,
            categoryId: categoryId || item.categoryId, 
        }));

        // Bulk insert!
        const insertedItems = await MenuItem.insertMany(itemsToSave);

        return NextResponse.json(
            { success: true, message: `${insertedItems.length} items added successfully`, items: insertedItems }, 
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error saving items:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session?.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDB();
        const { branchId } = await params;
        
        const itemId = req.nextUrl.searchParams.get("itemId");

        if (!itemId) {
            return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
        }

        const deletedItem = await MenuItem.findOneAndDelete({ 
            _id: itemId, 
            branchId: branchId 
        });

        if (!deletedItem) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        if (deletedItem.image && deletedItem.image.publicId) {
            await deleteCloudinaryImage(deletedItem.image.publicId)
                .catch((err: any) => console.error("Failed to clean up Cloudinary image:", err));
        }

        return NextResponse.json(
            { success: true, message: "Item deleted successfully" }, 
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error deleting item:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, {params}: RouteParams) {
    try {
        const session: any = await getServerSession(authOptions);
        if(!session?.user.id){
            return NextResponse.json({ error: "Unauthorized. Please log in again." }, { status: 401 });
        }

        const {branchId} = await params;
        const body = await req.json();
        
        const { itemId, categoryId, zoneId, name, isAvailable, price, description, image } = body;

        if (!itemId) {
            return NextResponse.json(
                { error: "Item ID is required for updating" }, 
                { status: 400 }
            );
        }

        await connectToDB();

        const updateFields: any = {};
        if (name !== undefined) updateFields.name = name;
        if (categoryId !== undefined) updateFields.categoryId = categoryId;
        if (zoneId !== undefined) updateFields.zoneId = zoneId;
        if (isAvailable !== undefined) updateFields.isAvailable = isAvailable;
        if (price !== undefined) updateFields.price = price;
        if (description !== undefined) updateFields.description = description;
        if (image !== undefined) updateFields.image = image;

        const updatedItem = await MenuItem.findOneAndUpdate(
            { _id: itemId, branchId: branchId },
            { $set: updateFields },
            { new: true } 
        );

        if (!updatedItem) {
            return NextResponse.json(
                { error: "Item not found or does not belong to this branch" }, 
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Item updated successfully", item: updatedItem },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Error updating item:", error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}