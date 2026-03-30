import { Check, Layout } from 'lucide-react';
import React from 'react'
import{ useState } from 'react';

const TemplateSelector = ({ selectedTemplate, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const templates = [
        { id: 'classic', name: 'Classic', preview: 'A clean and traditional resume layout with a focus on simplicity and readability.' },
        { id: 'modern', name: 'Modern', preview: 'A contemporary resume design with bold typography and a dynamic layout to showcase your skills and experience.' },
        { id: 'minimal', name: 'Minimal', preview: 'A sleek and minimalist resume template that emphasizes clarity and professionalism with a clean design.' },
        { id: 'minimal-image', name: 'Minimal with image', preview: 'A minimalist resume template that incorporates a profile image, allowing you to add a personal touch while maintaining a clean and professional look.' },
    ]
    return (
        <div className='relative'>
            <button className='flex items-center gap-1 text-sm text-blue-600
            bg-gradient-to-br from-blue-50 to-blue-100 ring-blue-300 hover:ring
            transition-all px-3 py-2 rounded-lg' onClick={() => setIsOpen(!isOpen)}>
                <Layout size={14} /> <span className='max-sm:hidden'>Template</span>
            </button>
            {isOpen && (
                <div className='absolute top-full w-xs p-3 mt-2 space-y-3 z-100 bg-white rounded-md 
                shadow-sm border border-gray-200'>
                    {templates.map(template => (
                        <div key={template.id} onClick={() => { onChange(template.id); setIsOpen(false) }} className={`relative p-3 rounded-md cursor-pointer border transition-all${selectedTemplate === template.id ? 'border-blue-400 bg-blue-100' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-100'}`}>
                        {selectedTemplate === template.id && 
                        <div className='absolute top-2 right-2'>
                            <div className='size-5 bg-blue-400 rounded-full flex
                            items-center justify-center'>
                                <Check className='w-3 h-3 text-white'/>

                            </div>
                        </div>
                        }
                        <div className='space-y-1'>
                        <h4 className='font-medium text-gray-800'>{template.name}</h4>
                        <div className='mt-2 p-2 bg-blue-50 rounded text-xm text-gray-500'>
                            {template.preview}
                            </div>
                        </div>

                        </div>

                    ))}
                    
                </div>
            )}

        </div>
    )
}

export default TemplateSelector