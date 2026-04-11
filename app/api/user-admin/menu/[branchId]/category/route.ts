import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { connectToDB } from "@/utils/connectToDb";
import Branches from "@/utils/models/Branches";
import MenuCategory from "@/utils/models/MenuCategory";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
    params: Promise<{ branchId: string }>
}
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
            return NextResponse.json({ error: "Unauthorized. Please log in again." }, { status: 401 });
        }

        const {branchId} = await params;

        await connectToDB()
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