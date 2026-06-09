import { CategoryProps } from "./MenuCategoyType";
import { MenuItem } from "./MenuItemType";

export interface CustomerProps {
  restaurant: {
    id: string
    name: string;
    address: string;
    slug: string;
  };
  menu: {
    categories: CategoryProps[];
    items: MenuItem[];
  }
}