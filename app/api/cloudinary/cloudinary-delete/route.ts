import { deleteCloudinaryImage } from '@/utils/cloudinary'; // Adjust path if needed
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { publicIds } = await req.json();

        if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
            return NextResponse.json({ success: true });
        }

        // Delete all orphaned images at the exact same time
        await Promise.all(publicIds.map(id => deleteCloudinaryImage(id)));

        return NextResponse.json({ success: true }, { status: 200 });
        
    } catch (error) {
        console.error("Cloudinary Cleanup Error:", error);
        return NextResponse.json({ error: 'Failed to clean up images' }, { status: 500 });
    }
}