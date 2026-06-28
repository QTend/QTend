import { connectToDB } from '@/utils/connectToDb';
import Table from '@/utils/models/Table';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"; 
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import Branches from '@/utils/models/Branches';

export async function POST(req: Request, { params }: { params: Promise<{ branchId: string }> }) {
    try {
        await connectToDB();
        const resolvedParams = await params;
        const { branchId } = resolvedParams;

        const body = await req.json();
        const { areas } = body; 

        if (!areas || !Array.isArray(areas) || areas.length === 0) {
            return NextResponse.json({ error: 'Please provide at least one area to create tables' }, { status: 400 });
        }

        const branch = await Branches.findById(branchId);
        if (!branch) {
            return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
        }

        const existingTables = await Table.find({ branchId });
        const newTablesData = [];
        const tableIdsToDelete: string[] = [];

        for (const area of areas) {
            const cleanAreaName = area.areaName.trim();
            const cleanPrefix = (area.prefix || area.areaName).trim().toUpperCase(); 
            const targetCount = parseInt(area.count);

            if (isNaN(targetCount) || targetCount <= 0 || !cleanAreaName) continue;

            const existingNumbers = new Set<number>();

            // 1. Scan existing tables for this specific prefix
            existingTables.forEach(t => {
                const nameLower = t.name.toLowerCase();
                const prefixLower = cleanPrefix.toLowerCase();
                
                if (nameLower.startsWith(prefixLower)) {
                    const match = t.name.match(/\d+$/);
                    if (match) {
                        const num = parseInt(match[0]);
                        
                        // If the table number is greater than what they want, mark it for deletion
                        if (num > targetCount) {
                            tableIdsToDelete.push(t._id.toString());
                        } else {
                            // Otherwise, record that this number already exists
                            existingNumbers.add(num);
                        }
                    }
                }
            });

            // 2. Generate only the missing tables up to the target count
            for (let i = 1; i <= targetCount; i++) {
                if (!existingNumbers.has(i)) {
                    const finalName = `${cleanPrefix}-${i}`;

                    newTablesData.push({
                        branchId: branchId,
                        name: finalName,
                        area: cleanAreaName, 
                        isActive: true
                    });
                }
            }
        }

        // 3. Execute Database Operations
        let deletedCount = 0;
        if (tableIdsToDelete.length > 0) {
            const deleteResult = await Table.deleteMany({ _id: { $in: tableIdsToDelete } });
            deletedCount = deleteResult.deletedCount || 0;
        }

        let insertedTables = [];
        if (newTablesData.length > 0) {
            insertedTables = await Table.insertMany(newTablesData);
        }

        // If nothing was added and nothing was deleted, tell the user it was already synced
        if (insertedTables.length === 0 && deletedCount === 0) {
             return NextResponse.json({ 
                success: true, 
                message: `Areas are already perfectly synced.`,
                newTables: [] 
            }, { status: 200 });
        }

        return NextResponse.json({ 
            success: true, 
            message: `Synced! Added ${insertedTables.length} tables and removed ${deletedCount} excess tables.`,
            newTables: insertedTables 
        }, { status: 201 });

    } catch (error: any) {
        console.error("Sync Bulk Tables Error:", error);
        return NextResponse.json({ error: error.message || 'Failed to sync tables' }, { status: 500 });
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