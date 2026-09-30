import webpush from 'web-push';
import PushSubscription from '@/utils/models/PushSubscription';
import { connectToDB } from '@/utils/connectToDb';

interface PushOptions {
  branchId: string;
  target: 'admin' | 'zones';
  zoneIds?: string[];
  title: string;
  body: string;
  url?: string;
}. 

let isVapidInitialized = false;

function initVapid() {
  if (isVapidInitialized) return;

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    console.warn('⚠️️ Web Push VAPID keys missing from environment variables.');
    return;
  }

  webpush.setVapidDetails(
    'mailto:support@qtend.com',
    publicKey,
    privateKey
  );

  isVapidInitialized = true;
}

export async function dispatchPushAlert({ branchId, target, zoneIds, title, body, url = '/' }: PushOptions) {
  try {
    // Lazily initialize VAPID details at runtime
    initVapid();

    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    if (!publicKey || !privateKey) return;

    await connectToDB();

    // 1. Determine target devices
    let query: any = { branchId };

    if (target === 'admin') {
      query.zoneId = null;
    } else if (target === 'zones' && zoneIds && zoneIds.length > 0) {
      query.zoneId = { $in: zoneIds };
    } else {
      query.zoneId = null;
    }

    // 2. Fetch matching subscriptions
    const subscriptions = await PushSubscription.find(query).lean();
    if (subscriptions.length === 0) return;

    const payload = JSON.stringify({ title, body, url });

    // 3. Dispatch push alerts and clean up dead subscriptions
    const pushPromises = subscriptions.map((sub: any) =>
      webpush.sendNotification(sub.subscription, payload).catch(async (err) => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          console.log('🗑️ Removing expired push subscription:', sub._id);
          await PushSubscription.deleteOne({ _id: sub._id });
        } else {
          console.error('Push delivery error:', err);
        }
      })
    );

    await Promise.all(pushPromises);
  } catch (error) {
    console.error('Error dispatching push alert:', error);
  }
}