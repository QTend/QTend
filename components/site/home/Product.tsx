


import React from 'react'
import { SmallHeader } from '../SmallHeader'
import { Header } from '../Header'
import { DescHeader } from '../DescHeader'
import { Check, Monitor, Smartphone } from 'lucide-react'
import Image from 'next/image'


function FeatureBadge({ text, bgColor = '#F67D26', Icon}: any) {
  return (
    <div 
      className="rounded-lg flex items-center w-fit px-2 py-0.5 text-white gap-1 text-xs font-medium mb-2"
      style={{ backgroundColor: bgColor }}
    >
      {Icon && <Icon size={14} />}
      <p>{text}</p>
    </div>
  );
}

 function FeatureSection({
  badgeText,
  badgeBgColor,
  badgeIcon,
  title,
  description,
  features = [],
  imageSrc,
  imageAlt,
  reversed = false,
  imageWeight,
  imageHeight
}: any) {
  return (
    <div className={`flex flex-col md:flex-row max-w-desktop mx-auto mt-16 items-center gap-8 ${reversed ? 'md:flex-row-reverse' : ''}`}>
      
      {/* Content Column */}
      <div className='flex flex-col justify-center flex-1'>
        {/* Reusable Badge */}
        <FeatureBadge text={badgeText} bgColor={badgeBgColor} Icon={badgeIcon} />
        
        {/* Typography */}
        <p className='font-bold text-2xl text-[#1D1D1F] mb-1'>{title}</p>
        <p className='text-lg text-[#6B6B6B] mb-5'>{description}</p>

        {/* Checkmark List */}
        <div className='flex flex-col gap-2'>
          {features.map((feature: any, index: any) => (
            <div key={index} className='flex gap-2 items-center'>
              <div className='bg-[#0E8A54] w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0'>
                <Check color='#fff' size={12} />
              </div>
              <p className='text-sm text-[#1D1D1F]'>{feature}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Image Column */}
      <div className='flex justify-center items-center flex-1'>
        <Image 
          src={imageSrc} 
          alt={imageAlt}
          width={imageWeight} 
          height={imageHeight} 
          className='object-cover'
        />
      </div>
    </div>
  );
}

export const Product = () => {
  return (
    <section className='p-16'>
        <SmallHeader text='PRODUCT' color='#F67D26' />
        <Header text='Built for Every Role in Your Business' />
        <DescHeader text='A seamless experience for guests, and a powerful command center for your
team.' />


        <FeatureSection
        badgeText="Guess Experience"
        badgeBgColor="#F67D26"
        badgeIcon={Smartphone}
        title="Frictionless Ordering on Any Phone"
        description="Guests scan, browse beautiful menus, add items, and place orders without downloading anything or creating an account."
        imageSrc="/phone.png"
        imageAlt="image of the customer side"
        imageWeight={218}
        imageHeight={475}
        features={[
          "Instant QR menu load — under 2 seconds",
          "Stunning photo-rich menu display",
          "Easy customizations and special requests",
          "Order status updates in real time"
        ]}
      />

      {/* Second Section (Reversed Layout with Custom Content) */}
      <FeatureSection
        reversed={true}
        badgeText="Secure Payments"
        badgeBgColor="#0E8A54" // Different color
        badgeIcon={Monitor}     // Different icon
        title="Safe and Instant Checkouts"
        description="Give your guests peace of mind with encrypted processing features directly from their mobile browser viewport."
        imageSrc="/dashboard.png"
        imageAlt="image of the payment gateway"
        imageWeight={803}
        imageHeight={340}
        features={[
          "Apple Pay & Google Pay ready",
          "Split check options built-in",
          "Instant digital receipts via email"
        ]}
      />


    </section>
  )
}
