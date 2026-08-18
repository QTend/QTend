export const pricingData = [
    {
        id: 1, 
        label: 'Digital Menu (Free)', 
        price: 0, 
        currency: '₦',
        isCustom: false,
        desc: 'Replace expensive paper menus. Perfect for getting your restaurant digitized at zero cost.',
        features: [
            'Unlimited tables & items',
            'Digital QR code generation',
            'Update prices instantly',
            'View-only (Customers order via waiter)'
        ],
        btnText: 'Start for Free',
        isPopular: false
    },
    {
        id: 2, 
        label: 'Starter', 
        price: 25000, 
        currency: '₦',
        isCustom: false,
        desc: 'Perfect for small cafés, bars, and food trucks doing counter service.',
        features: [
            'Everything in Free, plus:',
            'Customers order from their phone',
            'Live order management dashboard',
            'Real-time incoming alerts',
            'Email & WhatsApp support'
        ],
        btnText: 'Start 14-Day Trial',
        isPopular: false
    },
    {
        id: 3, 
        label: 'Pro', 
        price: 45000, 
        currency: '₦',
        isCustom: false,
        desc: 'For busy dine-in restaurants, clubs, and lounges that need deep kitchen routing.',
        features: [
            'Everything in Starter, plus:',
            'Call Waiter feature (Live requests)',
            'Kitchen Display System (KDS)',
            'Up to 5 prep zones (Grill, Bar, etc.)',
            'Advanced analytics & reports',
            'Priority customer support'
        ],
        btnText: 'Get Pro',
        isPopular: true
    }
]