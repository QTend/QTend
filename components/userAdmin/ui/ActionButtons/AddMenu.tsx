'use client'
import { ChevronDown, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Modal } from "../../screen/Modal";
import Switch from "../Switch";
import { GradientButton } from "../Buttons";


interface MenuState {
  name: string;
  category: string;
  price: string;
  description: string;
  image: string;
  isEnable: boolean;
}


export function AddMenu(){
    const [openModal, setOpenModal] = useState(false)
    const [menu, setMenu] = useState<MenuState>({
        name: '',
        category: '',
        price: '',
        description: '',
        image: '',
        isEnable: false,
    })
    const [menusItems, setMenusItems] = useState<any[]>([])


    const handleToggle = () => {
    setMenu(prev => ({
        ...prev,
        isEnable: !prev.isEnable
    }));
};


    // Prevent background scroll when modal is open
    useEffect(() => {
    if (openModal) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = 'auto'
    }

    // Cleanup on unmount
    return () => {
        document.body.style.overflow = 'auto'
    }
    }, [openModal])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setMenu((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; // Get the first selected file
        if (file) {
            setMenu((prev: any) => ({
            ...prev,
            image: file
            }));
        }
    };


    const handleAddMoreItems = () => {
        setMenusItems((prev) => [...prev, menu]);

        setMenu({
            name: '',
            category: '',
            price: '',
            description: '',
            image: '',
            isEnable: false,
        }); 
    }


    const closeModal = () => {
        setMenu({
            name: '',
            category: '',
            price: '',
            description: '',
            image: '',
            isEnable: false,
        }); 
        setMenusItems([])
        setOpenModal(false)
    }

    const handleSubmitItems = () => {
        console.log(menusItems)
    }

    return(
        <>
        <div onClick={() => setOpenModal(true)} className="flex items-center gap-1 text-[#68A544] border-[#68A544] border rounded-xl text-sm px-6 py-1 cursor-pointer"><Plus size={20} /> Add item</div>

        {
            openModal && (
            <Modal center={true} onClick={() => setOpenModal(false)} >
                <div onClick={(e) => e.stopPropagation()} className="w-140 max-h-[90vh] rounded-3xl relative overflow-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="bg-white px-6 py-10  ">
                        <div className="flex justify-between items-center">
                            <h6 className="font-medium text-2xl">Add new item</h6>
                            <div onClick={closeModal} className="w-10 h-10 bg-linear-to-r from-[#f67d265c] to-[#68a54432] rounded-full flex justify-center items-center cursor-pointer"><X /></div>
                        </div>
                        <p className="text-[#333333] my-5">Enter product details below</p>


                        {/* menus */}
                        <div className="flex flex-col gap-2 mb-4"> 
                            {
                                menusItems.map((menu, index) => (
                                    <div key={index} className="bg-[#EAECF0] rounded-2xl flex justify-between items-center p-4">
                                        <p className="text-[#101828]">{menu.name}</p>
                                        <ChevronDown />
                                    </div>
                                ))
                            }
                        </div>
                        

                        {/* form */}
                        <div className="bg-[#EAECF0] p-4 rounded-2xl grid gap-5 ">
                            <div className="flex gap-3">
                                <div className="flex flex-col gap-1 flex-1">
                                <label htmlFor="item-name" className="text-sm font-medium text-[#344054]">
                                    Name of item
                                </label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={menu.name}
                                    onChange={handleChange}
                                    className="w-full rounded-lg bg-white px-3 py-2 outline-none focus:border-[#F67D26] focus:ring-1 focus:ring-[#F67D26]"
                                    placeholder="e.g. Jollof Rice"
                                />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="item-name" className="text-sm font-medium text-[#344054]">
                                        Category
                                    </label>
                                    <input 
                                        type="text" 
                                        name="category"
                                        value={menu.category}
                                        onChange={handleChange}
                                        className="w-full rounded-lg bg-white px-3 py-2 outline-none focus:border-[#F67D26] focus:ring-1 focus:ring-[#F67D26]"
                                        placeholder="e.g. Jollof Rice"
                                    />
                                </div>
                            </div>

                            {/* price */}
                            <div className="flex flex-col gap-1">
                                <label htmlFor="item-name" className="text-sm font-medium text-[#344054]">
                                Price of item
                                </label>
                                <input 
                                    type="text" 
                                    name="price"
                                    value={menu.price}
                                    onChange={handleChange}
                                    className="w-full rounded-lg bg-white px-3 py-2 outline-none focus:border-[#F67D26] focus:ring-1 focus:ring-[#F67D26]"
                                    placeholder="₦ 0.00"
                                />
                            </div>

                            {/* description */}
                            <div className="flex flex-col gap-1">
                                <label htmlFor="item-name" className="text-sm font-medium text-[#344054]">
                                Description
                                </label>
                                <textarea 
                                value={menu.description}
                                name="description"
                                onChange={handleChange}
                                cols={40}
                                className="w-full rounded-lg bg-white px-3 py-2 outline-none focus:border-[#F67D26] focus:ring-1 focus:ring-[#F67D26] h-20"
                                placeholder="Write a description"
                                />
                            </div>

                            {/* image */}
                            <div className="flex flex-col gap-1">
                                <label htmlFor="item-name" className="text-sm font-medium text-[#344054]">
                                    Image of item
                                </label>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageChange} 
                                    className="w-full rounded-lg bg-white px-3 py-2 outline-none focus:border-[#F67D26] focus:ring-1 focus:ring-[#F67D26]"
                                    placeholder="e.g. Jollof Rice"
                                />
                            </div>

                            <div className="flex items-center gap-1">
                                <Switch enabled={menu.isEnable} onClick={handleToggle} />
                                <p className="text-sm">Item is available</p>
                            </div>
                            
                        </div>

                        <div onClick={handleAddMoreItems} className="my-5 bg-[#68A544] flex text-white w-fit px-3 py-2 rounded-xl" >
                            <Plus />
                            <p>Add more items</p>
                        </div>
                    </div>
                

                <div className="bg-[#F0F0F0] p-6">
                    <GradientButton onClick={handleSubmitItems} label="Add to menu" className="w-full" disabled={false}  />
                </div>
                </div>
            </Modal>
            )
        }
        
        </>
        
    )
}