'use client'
import React, { useRef, useState } from 'react'
import { FaPhoneAlt } from 'react-icons/fa'
import { GradientButton } from '../../ui/Buttons'
import Image from 'next/image'

const categories = [
    'Resturnat',
    'Cafe',
    'Fast Food',
    'Bar',
    'Food Truck',
    'Bakery'
]

export const AboutTwo = ({setSteps}: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    
  const [isDragging, setIsDragging] = useState(false);


    const handleFileChange = (selectedFile: File | undefined) => {
        if (selectedFile && selectedFile.type.startsWith("image/")) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile)); 
        }
    };

    const handleContinue = () => {
        setSteps('3')
    }

  return (
     <div >
        <div className='bg-[#68A544] w-fit p-5 rounded-xl mx-auto mb-5'>
        <FaPhoneAlt color='#ffffff' size={24} />
        </div>
        <h5 className='text-2xl text-center font-medium' >Where are you located?</h5>
        <p className='text-center text-black/80'>Help customers find you</p>

        <div className='mt-16 grid gap-2 mb-5'>
            <label htmlFor="" className='font-medium'>Business Adress</label>
            <input 
            type="text"
            placeholder='e.g 123 Main Street, Lagos'
            className='px-3 py-2 focus:outline-none border-gray-300 border rounded-xl'
            />
        </div>

        <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files[0]); 
      }}
      onClick={() => fileInputRef.current?.click()}
      className={`
        relative w-full h-36 rounded-2xl border 
        flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden mb-7
        ${isDragging ? "border-[#68A544] bg-[#68A544]/5" : "border-gray-300 bg-white hover:bg-gray-50"}
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e.target.files?.[0])}
        accept="image/*"
        className="hidden"
      />

      {preview ? (
        // Preview State
        <div className="relative w-full h-full">
          <Image 
            src={preview} 
            alt="Upload preview" 
            fill 
            className="object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/20 grid justify-center items-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <p className="text-white font-medium bg-black/50 px-4 py-2 rounded-full text-sm">
              Click to Change
            </p>
          </div>
          </div>
        </div>
      ) : (
        // Empty State
        <div className="text-center ">
          <p className="text-[#666666] font-medium text-sm">
              Click to upload or drag and drop
            </p>
          <p className="text-[#666666] font-medium text-xs">
            PNG, JPG up to 5MB
            </p>
        </div>
      )}
    </div>

        <div className='flex justify-between gap-3'>
            <GradientButton label='Bck' variant='outline' onClick={() => setSteps('1')} className='w-full' />
                <GradientButton label='Continue' onClick={handleContinue} className='w-full' />
        </div>
        
    </div>
  )
}