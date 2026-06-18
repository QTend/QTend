import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { connectToDB } from "@/utils/connectToDb";
import Branches from "@/utils/models/Branches";
import Membership from "@/utils/models/Membership";
import User from "@/utils/models/User";
import { getServerSession } from "next-auth";
import { cache } from "react";


export function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export const getCurrentBranch = cache(async (slug: string) => {
    if (!slug) return null;

    const session: any = await getServerSession(authOptions);
    if (!session?.user?.id) return null;

    await connectToDB();

    const branch = await Branches.findOne({ slug }).lean();
    if (!branch) return null;

    const membership = await Membership.findOne({
        userId: session.user.id,
        branchId: branch._id
    }).lean();

    if (!membership) return null;

    const user = await User.findById(membership.userId)
        .select('email name')
        .lean();

    return serialize({
        branch,
        user,
    });
});