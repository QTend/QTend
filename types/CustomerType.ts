import { BranchProps } from "./BranchType";
import { CategoryProps } from "./MenuCategoyType";
import { MenuItem } from "./MenuItemType";

export interface CustomerProps {
  restaurant: BranchProps & {
    id: string;
    coverImage: {
      url: string
    };
    plan: string
  }
  menu: {
    categories: CategoryProps[];
    items: MenuItem[];
  }
}