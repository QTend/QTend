import { NextResponse } from "next/server";
import { generateCloudinarySignature } from "@/utils/cloudinary"; // Make sure this path is correct

export async function POST(req: Request) {
    try {
        const { folder } = await req.json();
        const folderName = folder || 'general';

        // NOW you are using your utility function!
        const { timestamp, signature } = generateCloudinarySignature(folderName);

        return NextResponse.json({ 
            timestamp, 
            signature, 
            folder: folderName 
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to sign upload' }, { status: 500 });
    }
}