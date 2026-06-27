import { connectToDB } from '@/utils/connectToDb';
import Table from '@/utils/models/Table';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"; 
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import Branches from '@/utils/models/Branches';

export async function POST(req: Request, { params }: { params: Promise<{ branchId: string }> }) {
    const session: any = await getServerSession(authOptions);
    if (!session?.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await connectToDB();
        const resolvedParams = await params;
        const { branchId } = resolvedParams;

        const body = await req.json();
        const { prefix = "", count } = body; 
        
        const targetCount = parseInt(count);
        if (isNaN(targetCount) || targetCount <= 0) {
            return NextResponse.json({ error: 'A valid number count is required' }, { status: 400 });
        }

        const cleanPrefix = prefix.trim();

        // 1. Fetch the branch
        const branch = await Branches.findById(branchId);
        if (!branch) {
            return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
        }

        // 2. Fetch all existing tables to check where we should start numbering
        const existingTables = await Table.find({ branchId });
        
        let maxNum = 0;

        existingTables.forEach(t => {
            const nameLower = t.name.toLowerCase();
            const prefixLower = cleanPrefix.toLowerCase();

            // Only look at tables that match the current prefix (or all of them if prefix is blank)
            if (cleanPrefix === "" || nameLower.startsWith(prefixLower)) {
                // Regex: Extract the numbers at the VERY END of the string (e.g., "Room-42" -> 42)
                const match = t.name.match(/\d+$/);
                if (match) {
                    const num = parseInt(match[0]);
                    if (num > maxNum) maxNum = num; // Find the highest existing number
                }
            }
        });

        // 3. Generate the new tables starting exactly where the DB left off
        const newTablesData = [];
        for (let i = 1; i <= targetCount; i++) {
            const nextNum = maxNum + i;
            
            // Format: "Room-1" or just "1" if they left prefix blank
            const finalName = cleanPrefix ? `${cleanPrefix}-${nextNum}` : `${nextNum}`;

            newTablesData.push({
                branchId: branchId,
                name: finalName,
                isActive: true
            });
        }

        // 4. Bulk Insert
        const insertedTables = await Table.insertMany(newTablesData);

        return NextResponse.json({ 
            success: true, 
            message: `Successfully created ${targetCount} tables`,
            newTables: insertedTables 
        }, { status: 201 });

    } catch (error: any) {
        console.error("Create Bulk Tables Error:", error);
        return NextResponse.json({ error: error.message || 'Failed to create tables' }, { status: 500 });
    }
}


export async function GET(req: Request, { params }: { params: Promise<{ branchId: string }> }) {
   
    const session: any = await getServerSession(authOptions);
    if (!session?.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await connectToDB();
        
        const resolvedParams = await params;
        const { branchId } = resolvedParams;

        if (!branchId) {
            return NextResponse.json({ error: 'Branch ID is required' }, { status: 400 });
        }

        // Fetch all tables for this branch
        // The collation object forces MongoDB to sort "10" after "2", even though they are strings!
        const tables = await Table.find({ branchId })
            .collation({ locale: "en_US", numericOrdering: true })
            .sort({ name: 1 }); 

        return NextResponse.json({ 
            success: true, 
            tables 
        }, { status: 200 });

    } catch (error: any) {
        console.error("Fetch Tables Error:", error);
        return NextResponse.json({ error: 'Failed to fetch tables' }, { status: 500 });
    }
}