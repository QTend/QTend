import { connectToDB } from "@/utils/connectToDb";
import AdminCategory from "@/utils/models/AdminCategory";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest){
    const {name, description} = await req.json()
    try {
        await connectToDB();

       await AdminCategory.create({
            name,
            description
        })

        return NextResponse.json({messagge: 'Categiyr succussful', success: true})
    } catch (error: any) {
        console.error("Category Error:", error);
        return NextResponse.json({ 
        error: error.code === 11000 ? "Business name already taken" : "Internal Server Error" 
        }, { status: 500 });  
    }
}


export async function GET(){
    try {
        await connectToDB();

        const categories = await AdminCategory.find({}).sort({ createdAt: -1 });

        return NextResponse.json(
            { success: true, data: categories },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
        { error: 'Server error. Could not retrieve categories.' },
        { status: 500 }
        );
    }
}