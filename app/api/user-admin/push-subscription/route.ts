import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/utils/connectToDb';
import PushSubscription from '@/utils/models/PushSubscription';

export async function POST(req: NextRequest) {
  try {
    const { subscription, branchId, zoneId } = await req.json();

    if (!subscription || !subscription.endpoint || !branchId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    await connectToDB();

    await PushSubscription.findOneAndUpdate(
      { 'subscription.endpoint': subscription.endpoint },
      {
        branchId,
        zoneId: zoneId || null,
        subscription,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Push Subscription Error:', error);
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
}