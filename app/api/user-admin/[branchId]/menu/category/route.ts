import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { connectToDB } from "@/utils/connectToDb";
import Branches from "@/utils/models/Branches";
import MenuCategory from "@/utils/models/MenuCategory";
import MenuItem from "@/utils/models/MenuItem";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
    params: Promise<{ branchId: string }>
}


export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, {params}: RouteParams){
    try {
        const session: any = await getServerSession(authOptions)

        if(!session?.user.id){
            return NextResponse.json({ error: "Unauthorized. Please log in again." }, { status: 401 });
        }


        const {branchId} = await params
        const body = await req.json()
        const {name, isAvailable} = body;

        await connectToDB();

        const branchExist = await Branches.findById(branchId);
        if(!branchExist){
            return NextResponse.json(
                {error: 'Branch does not exist'},
                {status: 400}
            )
        }

        await MenuCategory.create({
            branchId,
            name,
            isAvailable
        });

        return NextResponse.json(
            {success: true, message: 'Category successfully created'},
            {status: 200}
        )
    } catch (error: any) {
        console.error("Error creating category:", error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}


export async function GET(req: NextRequest, {params}: RouteParams){
    try {
        const session: any = await getServerSession(authOptions)
         if(!session?.user.id){
            console.log('session', 'proble')
            return NextResponse.json({ error: "Unauthorized. Please log in again." }, { status: 401 });
        }

        const {branchId} = await params;
        if(!branchId){
            console.log('No branch Is')
            return NextResponse.json({ error: "No branchId." }, { status: 404});
        }
        

        await connectToDB();
        const branchExist = await Branches.findById(branchId);
        if(!branchExist){
            return NextResponse.json(
                {error: 'Branch does not exist'},
                {status: 400}
            )
        }

        const categories = await MenuCategory.find({branchId}).sort({createdAt: -1}).lean()

        return NextResponse.json(
            { success: true, categories },
            { status: 200 }
        )
    } catch (error: any) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}



export async function DELETE(req: NextRequest, {params} : RouteParams){
    try {
        const session: any = await getServerSession(authOptions)

        if(!session?.user.id){
            return NextResponse.json({ error: "Unauthorized. Please log in again." }, { status: 401 });
        }

        const {branchId} = await params;
        
        const categoryId = req.nextUrl.searchParams.get("categoryId");

        if (!categoryId) {
            return NextResponse.json(
                { error: "Category ID is required" }, 
                { status: 400 }
            );
        }

        await connectToDB();

        const branchExist = await Branches.findById(branchId);
        if(!branchExist){
            return NextResponse.json(
                {error: 'Branch does not exist'},
                {status: 404} 
            )
        }
        
        // Delete the Category first
        const deletedCategory = await MenuCategory.findOneAndDelete({
            _id: categoryId,
            branchId: branchId
        });

        if (!deletedCategory) {
            return NextResponse.json(
                { error: "Category not found or does not belong to this branch" },
                { status: 404 }
            );
        }

        // Delete all food items that belonged to this category
        const deletedItems = await MenuItem.deleteMany({ categoryId: categoryId });

        return NextResponse.json(
            { 
                success: true, 
                message: `Category and ${deletedItems.deletedCount} associated items successfully deleted.` 
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Error deleting category:", error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
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
        const { categoryId, name, isAvailable } = body;

        if (!categoryId || !name?.trim()) {
            return NextResponse.json(
                { error: "Category ID and a valid name are required" }, 
                { status: 400 }
            );
        }

        await connectToDB();

        const updatedCategory = await MenuCategory.findOneAndUpdate(
            { _id: categoryId, branchId: branchId },
            { name, isAvailable },
            { new: true } // This tells Mongoose to return the newly updated document
        );

        if (!updatedCategory) {
            return NextResponse.json(
                { error: "Category not found or does not belong to this branch" }, 
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Category updated successfully", category: updatedCategory },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Error updating category:", error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}