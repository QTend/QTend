import webpush from 'web-push';
import PushSubscription from '@/utils/models/PushSubscription';
import { connectToDB } from '@/utils/connectToDb';

// Configure Web Push with your VAPID keys
webpush.setVapidDetails(
  'mailto:hello@getqtend.com', // Your contact email
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

interface PushOptions {
  branchId: string;
  target: 'admin' | 'zones';
  zoneIds?: string[]; // Only required if target is 'zones'
  title: string;
  body: string;
  url?: string;
}

export async function dispatchPushAlert({ branchId, target, zoneIds, title, body, url = '/' }: PushOptions) {
  try {
    await connectToDB();

    // 1. Determine which devices to alert based on your workflow rules
    let query: any = { branchId };
    
    if (target === 'admin') {
      // Alert only devices without a specific zone (Managers/Admins)
      query.zoneId = null;
    } else if (target === 'zones' && zoneIds && zoneIds.length > 0) {
      // Alert only the specific kitchen stations handling this order
      query.zoneId = { $in: zoneIds };
    } else {
      // Fallback: If it's a zone target but no zones provided, alert admin
      query.zoneId = null; 
    }

    // 2. Fetch the matching subscriptions from MongoDB
    const subscriptions = await PushSubscription.find(query).lean();

    if (subscriptions.length === 0) return;

    const payload = JSON.stringify({ title, body, url });

    // 3. Dispatch to Apple/Google and clean up expired tokens
    const pushPromises = subscriptions.map((sub: any) =>
      webpush.sendNotification(sub.subscription, payload).catch(async (err) => {
        // 410 (Gone) or 404 (Not Found) means the user revoked permission or cleared browser data
        if (err.statusCode === 410 || err.statusCode === 404) {
          console.log('🗑️ Removing dead push subscription:', sub._id);
          await PushSubscription.deleteOne({ _id: sub._id });
        } else {
          console.error('Push delivery failed:', err);
        }
      })
    );

    await Promise.all(pushPromises);
  } catch (error) {
    console.error('Error dispatching push alerts:', error);
  }
}