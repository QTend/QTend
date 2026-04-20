import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/utils/connectToDb";
import MenuItem from "@/utils/models/MenuItem"; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import mongoose from "mongoose"; // <--- ADDED THIS

type RouteParams = {
    params: Promise<{ branchId: string }>
}

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        await connectToDB();
        const { branchId } = await params;
        
        // Grab categoryId from the URL query parameter
        const categoryId = req.nextUrl.searchParams.get("categoryId");

        // Build the database query dynamically
        const query: any = { branchId };
        if (categoryId) {
            query.categoryId = categoryId; // Only filter by category if it exists in the URL
        }

        const items = await MenuItem.find(query).populate('categoryId', 'name _id');

        return NextResponse.json({ items }, { status: 200 });
    } catch (error: any) {
        console.error("Error saving items:", error);
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
        
        // Grab categoryId from the URL (if the frontend passed it)
        const categoryId = req.nextUrl.searchParams.get("categoryId");
        
        const body = await req.json();
        const { items } = body; 

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "No items provided" }, { status: 400 });
        }

        // Map over the items to attach the branch, category, and a dummy typeId
        const itemsToSave = items.map((item: any) => ({
            ...item,
            branchId,
            categoryId: categoryId || item.categoryId, 
            
            // typeId: new mongoose.Types.ObjectId(), 
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
        // 1. Authenticate the user
        const session: any = await getServerSession(authOptions);
        if (!session?.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDB();
        const { branchId } = await params;
        
        // 2. Grab the itemId from the URL query parameter
        const itemId = req.nextUrl.searchParams.get("itemId");

        if (!itemId) {
            return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
        }

        // 3. Delete the item. 
        // We check BOTH _id and branchId to ensure a user can't maliciously delete an item from another branch!
        const deletedItem = await MenuItem.findOneAndDelete({ 
            _id: itemId, 
            branchId: branchId 
        });

        if (!deletedItem) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
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
        
        // Destructure itemId and all possible fields that could be updated
        const { itemId, categoryId, name, isAvailable, price, description, image } = body;

        if (!itemId) {
            return NextResponse.json(
                { error: "Item ID is required for updating" }, 
                { status: 400 }
            );
        }

        await connectToDB();

        // Build a dynamic update object. 
        // This ensures we ONLY overwrite the fields the frontend actually sent!
        const updateFields: any = {};
        if (name !== undefined) updateFields.name = name;
        if (categoryId !== undefined) updateFields.categoryId = categoryId;
        if (isAvailable !== undefined) updateFields.isAvailable = isAvailable;
        if (price !== undefined) updateFields.price = price;
        if (description !== undefined) updateFields.description = description;
        if (image !== undefined) updateFields.image = image;

        const updatedItem = await MenuItem.findOneAndUpdate(
            { _id: itemId, branchId: branchId },
            { $set: updateFields }, // Mongoose applies the specific field updates here
            { new: true } // Returns the newly updated document
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