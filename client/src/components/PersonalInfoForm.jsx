import React from 'react'
import {BriefcaseBusiness, Linkedin, Mail, MapPin, Phone, User,Globe} from 'lucide-react'

const PersonalInfoForm = ({data, onChange, removeBackground, setRemoveBackground}) => {
  
    const handleChange = (field, value) => {
        
        onChange({...data, [field]: value}); 
    }

    const fields = [
        {key:'full_name', label:'Full Name',icon:User, type:'text', required:true},
        // allow any valid email address
    // allow any valid email address
    {key:'email', label:'Email Address', icon:Mail, type:'email', pattern:"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.\-]+\\.[A-Za-z]{2,}$", required:true},
        // allow an optional leading + for international numbers; require 10-13 digits (plus optional leading +)
        {key:'phone', label:'Phone Number', icon: Phone, type:'tel', pattern:"^\\+?[0-9]{10,13}$", required:true,  inputMode:"numeric", maxLength: 14},
        {key:'location', label:'Address', icon: MapPin, type:'text'},    
        {key:'profession', label:'Profession', icon: BriefcaseBusiness, type:'text'},
        {key:'linkedin', label:'LinkedIn Profile', icon: Linkedin, type:'url'},
        {key:'website', label:'Personal Website', icon: Globe, type:'url'}
        
    ]
  
    return (
    <div>
        <h3 className='text-lg font-semibold text-gray-900'>Personal Information</h3>
        <p className='text-sm text-gray-600'>Get Started with the personal information</p>
        <div className='flex items-center gap-2'>
            <label>
                {data.image ? (
                    <img src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)} alt='user-image' className='w-16 h-16 rounded-full object-cover mt-5 ring ring-slate-300 hover:opacity-80'/>)
                    : (<div className='inline-flex items-center gap-2 mt-5 text-slate-600 hover:text-slate-700 cursor-pointer'>
                        <User className='size-10 p-2.5 border rounded-full'/>
                        upload user image
                    </div>)}
                <input type='file' accept='image/jpeg, image/png' className='hidden' onChange={(e)=> handleChange('image',e.target.files[0])} />
            </label>
            {typeof data.image === 'object' && (
                <div className='flex flex-col gap-1 pl-4 text-sm'>
                    <p>Remove Backround</p>
                    <label className='relative inline-flex items-center cursor-pointer
                    text-gray-900 gap-3'>
                        <input type='checkbox' className='sr-only peer' checked={removeBackground} onChange={()=> setRemoveBackground(prev => !prev)} />
                        <div className='w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200'>
                        </div>
                        <span className='dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4'></span>
                    </label>
                </div>)}

        </div>
        {/* User personal info fields */}
        {fields.map((field)=>{
            const Icon= field.icon;
            return(
                <div key={field.key} className='space-y-1 mt-5'>
                    <label className='flex items-center gap-2 text-sm font-medium text-gray-600'>
                        <Icon className='size-4'/>
                        {field.label}
                        {field.required && <span className='text-red-500'>*</span>}
                    </label>
                    <input type={field.type} value={data[field.key] || "" } pattern={field.pattern || undefined} inputMode={field.inputMode || undefined} maxLength={field.maxLength || undefined}
                    onChange={(e)=>{
                        const val = e.target.value;
                        if(field.key === 'phone'){
                            // allow a single leading +, strip all other non-digit characters
                            // enforce maximum of 13 digits (not counting a leading +)
                            const hasLeadingPlus = val.startsWith('+');
                            const digitsOnly = val.replace(/\D/g, '');
                            const limitedDigits = digitsOnly.slice(0, 13);
                            // preserve a leading + even if there are no digits yet (so user can type + then numbers)
                            const finalVal = hasLeadingPlus ? ('+' + limitedDigits) : limitedDigits;
                            handleChange(field.key, finalVal);
                        } else {
                            // for email, trim whitespace
                            handleChange(field.key, field.key === 'email' ? val.trim() : val);
                        }
                    }}
                    className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring
                    focus:ring-blue-500 focus:border-blue-500 outline-none
                    transition-colors text-sm' placeholder={`Enter your ${field.label.toLowerCase()}`}
                    required={field.required}/>
                    {field.key === 'phone' && (data[field.key] || "") && !/^\\+?[0-9]{10,14}$/.test(data[field.key] || "")
                        // <p className='text-xs text-red-600 mt-1'>Phone must be 10 to 13 digits (optional leading +)</p>
                    }
                    {field.key === 'email' && (data[field.key] || "") && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/.test((data[field.key] || '').trim()) && (
                        <p className='text-xs text-red-600 mt-1'>Please enter a valid email address</p>
                    )}
                </div>
            )
        })}
    
    </div>
  )
}

export default PersonalInfoForm