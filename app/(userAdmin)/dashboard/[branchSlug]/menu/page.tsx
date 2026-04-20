import MenuTable from "@/components/userAdmin/ui/MenuTable";
import { getCurrentBranch } from "@/lib/get-current-branch";
import { BranchProps } from "@/types/BranchType";


export default async function Menu ({params}: {params: Promise<{branchSlug: string}>}) {

     const {branchSlug} = await params;

    const branch : BranchProps = await getCurrentBranch(branchSlug)
    
    return  (
        <MenuTable branch={branch}/>
    )
}   