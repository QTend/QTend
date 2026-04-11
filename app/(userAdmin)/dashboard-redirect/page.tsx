import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";
import { connectToDB } from "@/utils/connectToDb";
import Membership from "@/utils/models/Membership";
import Branches from "@/utils/models/Branches";



export default async function DashboardRedirect(){
    const session : any = await getServerSession(authOptions);


    if(!session)redirect('/auth/sign-in');

    await connectToDB();

    const membership = await Membership.findOne({userId: session.user.id});

    if(!membership){
        redirect('/onboarding/about-business');
    }

    const branch = await Branches.findById(membership.branchId);



    redirect(`/dashboard/${branch.slug}/menu`);
}