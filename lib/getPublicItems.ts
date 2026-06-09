import { connectToDB } from "@/utils/connectToDb";
import Branches from "@/utils/models/Branches";
import MenuCategory from "@/utils/models/MenuCategory";
import MenuItem from "@/utils/models/MenuItem";
import { cache } from "react";




export const getPublicItems = cache(async (slug: string) => {
    if(!slug) return null;

    await connectToDB();

    const branch = await Branches.findOne({ slug }).lean();
    if(!branch) return null;

    const [categories, items] = await Promise.all([
        MenuCategory.find({ branchId: branch._id, isAvailable: true }).lean(),
        MenuItem.find({ branchId: branch._id, isAvailable: true }).lean()
    ]);

    return JSON.parse(JSON.stringify({
        restaurant: { name: branch.name, address: branch.address, id: branch._id, slug: branch.slug},
        menu: { categories, items }
    }))
})