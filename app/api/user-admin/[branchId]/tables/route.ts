import { connectToDB } from '@/utils/connectToDb';
import Table from '@/utils/models/Table'; // Make sure you have your Branch model imported
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
        const { targetCount } = body; 

        if (!targetCount || typeof targetCount !== 'number' || targetCount <= 0) {
            return NextResponse.json({ error: 'Invalid target count' }, { status: 400 });
        }

        // 2. Fetch the branch so we can use its slug for the QR Links
        const branch = await Branches.findById(branchId);
        if (!branch) {
            return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
        }

        // 3. Fetch all existing tables for this branch
        const existingTables = await Table.find({ branchId });
        const currentCount = existingTables.length;

        // If they already have enough tables, do nothing
        if (targetCount <= currentCount) {
            return NextResponse.json({ 
                error: `You already have ${currentCount} tables. Enter a number higher than ${currentCount} to create more.` 
            }, { status: 400 });
        }

        // 4. Find the highest numeric table currently in the DB to avoid naming collisions
        let maxTableNum = 0;
        existingTables.forEach(t => {
            const num = parseInt(t.name);
            if (!isNaN(num) && num > maxTableNum) {
                maxTableNum = num;
            }
        });

        // 5. Generate the new tables
        const tablesToCreate = targetCount - currentCount;
        const newTablesData = [];
       

        for (let i = 1; i <= tablesToCreate; i++) {
            const nextTableNumber = (maxTableNum + i).toString(); // Save it as a String!
            
            newTablesData.push({
                branchId: branchId,
                name: nextTableNumber,
                isActive: true
            });
        }

        // 6. Bulk Insert into MongoDB (Much faster than saving them one by one)
        const insertedTables = await Table.insertMany(newTablesData);

        return NextResponse.json({ 
            success: true, 
            message: `Successfully created ${tablesToCreate} new tables`,
            newTables: insertedTables 
        }, { status: 201 });

    } catch (error: any) {
        console.error("Create Tables Error:", error);
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

        // 2. Fetch all tables for this branch
        // The collation object forces MongoDB to sort "10" after "2", even though they are strings!
        const tables = await Table.find({ branchId })
            .collation({ locale: "en_US", numericOrdering: true })
            .sort({ name: 1 }); 

        // 3. Return the clean list to the frontend
        return NextResponse.json({ 
            success: true, 
            tables 
        }, { status: 200 });

    } catch (error: any) {
        console.error("Fetch Tables Error:", error);
        return NextResponse.json({ error: 'Failed to fetch tables' }, { status: 500 });
    }
}