// import { Palette } from 'lucide-react';
import { LuPalette,LuCheck } from 'react-icons/lu';
import React from 'react'
import { useState } from 'react';
// import { Check } from 'lucide-react';

const colorPicker = ({selectedColor, onChange}) => {
    const colors = [
        {name: 'Blue', value: '#3b82f6'},
        {name: 'Green', value: '#10b981'},
        {name: 'Red', value: '#ef4444'},
        {name: 'Yellow', value: '#f59e0b'},
        {name: 'Purple', value: '#8b5cf6'},
        {name: 'Pink', value: '#ec4899'},
        {name: 'Gray', value: '#6b7280'},
        {name: 'Black', value: '#111111'},
        {name: 'Teal', value: '#14b8a6'},
        {name: 'Indigo', value: '#6366f1'},
        {name: 'Orange', value: '#f97316'},
        {name: 'Violet', value: '#8b5cf6'},
        {name: 'Rose', value: '#f43f5e'},
        {name: 'Amber', value: '#f59e0b'},
        {name: 'Emerald', value: '#10b981'},
        {name: 'Fuchsia', value: '#d946ef'},
        {name: 'Rosewood', value: '#b91c1c'},
        {name: 'Mint', value: '#22c55e'}
    ]

    const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='relative'>
        <button className='flex items-center gap-1 text-sm text-purple-600
            bg-gradient-to-br from-purple-50 to-purple-100 ring-purple-300 hover:ring
            transition-all px-3 py-2 rounded-lg' onClick={() => setIsOpen(!isOpen)}>
             <LuPalette size={16}/><span className='max-sm:hidden'>Accent</span>
            </button>

            {isOpen && (
                <div className='grid grid-cols-5 w-80 gap-2 absolute top-full left-0 
                right-0 p-3 mt-2 z-10 bg-white rounded-md border-gray-200 shodow-sm'>
                    {colors.map((color)=>(
                        <div key={color.value} className='relative cursor-pointer group flex flex-col'
                        onClick={()=>{onChange(color.value); setIsOpen(false)}}>
                            <div className='w-12 h-12 rounded-full border-2 border-transparent group-hover:border-black/25 transition-colors' style={{backgroundColor:color.value}}>
                            </div>
                            {selectedColor === color.value && (
                                <div className='absolute top-0 left-0 right-0 bottom-4.5 flex items-center justify-center'>
                                    <LuCheck className='size-5 text-white'/>
                                </div>
                            )}
                            <p className='text-xs text-center mt-1 text-gray-600'>{color.name}</p>
                        </div>))}
                </div>
            )   }
    </div>
  )
}

export default colorPicker