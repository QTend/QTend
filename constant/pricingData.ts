export const pricingData = [
    {
        id: 1, 
        label: 'Free', 
        price: 0, 
        currency: '₦',
        isCustom: false,
        desc: 'Perfect for pop-ups, small events, or testing out the platform.',
        features: [
            'Maximum of 10 menu items',
            'Digital QR code generation',
            'View-only menu',
            'QTend branding on menu'
        ],
        btnText: 'Free Plan', // Default starting plan
        isPopular: false
    },
    {
        id: 2, 
        label: 'Digital Menu (Basic)', 
        price: 5000, 
        currency: '₦',
        isCustom: false,
        desc: 'Replace expensive paper menus. Perfect for cafés, wine lists, and standard view-only menus.',
        features: [
            'Unlimited items & categories',
            'Remove QTend branding',
            'Update prices instantly',
            'View-only (Customers order via waiter)'
        ],
        btnText: 'Current Plan',
        isPopular: false
    },
    {
        id: 3, 
        label: 'Starter', 
        price: 25000, 
        currency: '₦',
        isCustom: false,
        desc: 'Perfect for small lounges, bars, and food trucks doing counter service.',
        features: [
            'Everything in Basic, plus:',
            'Customers order from their phone',
            'Live order management dashboard',
            'Real-time incoming alerts',
            'Email & WhatsApp support'
        ],
        btnText: 'Upgrade to Starter', 
        isPopular: false
    },
    {
        id: 4, 
        label: 'Pro', 
        price: 45000, 
        currency: '₦',
        isCustom: false,
        desc: 'For busy dine-in restaurants, clubs, and lounges that need deep kitchen routing.',
        features: [
            'Everything in Starter, plus:',
            'Call Waiter feature (Live requests)',
            'Kitchen Display System (KDS)',
            'Unlimited prep zones (Grill, Bar, etc.)',
            'Advanced analytics & reports',
            'Priority customer support'
        ],
        btnText: 'Upgrade to Pro',
        isPopular: true
    }
]