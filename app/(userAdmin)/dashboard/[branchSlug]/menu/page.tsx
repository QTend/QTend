import MenuTable from "@/components/userAdmin/ui/MenuTable";
import { getCurrentBranch } from "@/lib/get-current-branch";
import { BranchProps } from "@/types/BranchType";


export default function Menu ({params}: {params: Promise<{branchSlug: string}>}) {

  
    return  (
        <MenuTable />
    )
}   