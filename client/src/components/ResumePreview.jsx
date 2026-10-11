import React from 'react'
import ClassicTemplate from './templates/ClassicTemplate'
import ModernTemplate from './templates/ModernTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'
import ExecutiveTemplate from './templates/ExecutiveTemplate'
import CompactTemplate from './templates/CompactTemplate'
import BannerTemplate from './templates/BannerTemplate'
import TimelineTemplate from './templates/TimelineTemplate'
import GraduateTemplate from './templates/GraduateTemplate'


const ResumePreview = ({data,template, accentColor, classes=""}) => {
  
    const renderTemplate = () => {
        switch(template) {
            case 'classic':
                return <ClassicTemplate data={data} accentColor={accentColor} />;
            case 'modern':
                return <ModernTemplate data={data} accentColor={accentColor} />;
            case 'minimal':
                return <MinimalTemplate data={data} accentColor={accentColor} />;
            case 'minimal-image':
                return <MinimalImageTemplate data={data} accentColor={accentColor} />;
            case 'executive':
                return <ExecutiveTemplate data={data} accentColor={accentColor} />;
            case 'compact':
                return <CompactTemplate data={data} accentColor={accentColor} />;
            case 'banner':
                return <BannerTemplate data={data} accentColor={accentColor} />;
            case 'timeline':
                return <TimelineTemplate data={data} accentColor={accentColor} />;
            case 'graduate':
                return <GraduateTemplate data={data} accentColor={accentColor} />;
            default:
                return <ClassicTemplate data={data} accentColor={accentColor} />;
        }}

    return (
    <div className='w-full bg-gray-100'>
        <div id='resume-preview' className={"border border-gray-200 print:shadow-none print:border-none" + classes}>
            {renderTemplate()}
        </div>
    <style>
        {`
        @page {
            size: letter;
            margin: 0;
        }
         @media print {
         html, body {
            width: 8.5in;
            height: 11in;
            margin: 0;
            padding: 0;
            overflow: hidden;
        } 
            body * {
                visibility: hidden;
            }
             #resume-preview, #resume-preview * {
                visibility: visible;
            }
             #resume-preview {
                position: absolute;
                left: 0;  
                top: 0;
                width: 100%;
                height: auto;
                margin: 0;
                padding: 0;
                box-shadow: none !important;
                border: none !important;
             } 
          }
            
        `}
        
        </style>

    </div>
  )
}

export default ResumePreview