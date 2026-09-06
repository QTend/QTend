export type BranchProps = {
    _id: string;
    name: string;
    email: string
    description: string;
    phone: string;
    website: string;
    plans:{
        planType: 'basic' | 'starter' | 'pro';
        isTrial: boolean;
        expiryDate: Date;
    };
    category: string;
    slug: string;
    location: {
        address: string;
        state: string;
        country: string;
        postalCode: string;
    } 
    isActive: boolean;
    socials: {
        instagram: string;
        x:string;
        tiktok: string
    };
    branding: {
        logo: {
            url: String;
            publicId: String
        };
        coverImage: {
            url: String;
            publicId: String
        };
    }
} 