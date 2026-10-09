import React, { useState } from 'react';
// import { Check, Layout } from 'lucide-react';
import { FaCheck, } from 'react-icons/fa';
import { LuLayoutDashboard } from 'react-icons/lu';
import SEO from './SEO';

const TemplateSelector = ({ selectedTemplate, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const templates = [
        { id: 'classic', name: 'Classic', preview: 'Clean, timeless layout focused on readability.' },
        { id: 'modern', name: 'Modern', preview: 'Contemporary layout with bold typography and clear sections.' },
        { id: 'minimal', name: 'Minimal', preview: 'Sleek, minimal design emphasizing whitespace and clarity.' },
        { id: 'minimal-image', name: 'Minimal with image', preview: 'Minimal layout that includes a profile image option.' },
    ];

    return (<>
    <SEO title="Choose Resume Template | Prime Resume AI" description="Select from a variety of professional resume templates to create your perfect CV. Our templates are designed to be ATS-friendly and visually appealing, helping you stand out to employers." />
        <div className="relative">
            <button
                onClick={() => setIsOpen(v => !v)}
                className="inline-flex items-center gap-2 text-sm font-medium text-sky-600 bg-white px-3 py-2 rounded-lg shadow-sm ring-1 ring-sky-100 hover:shadow-md transition"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <LuLayoutDashboard size={16} />
                <span className="hidden sm:inline">Templates</span>
            </button>

            {isOpen && (
                <div className="absolute top-full mt-3 left-0 z-50 origin-top-left w-[360px] max-w-[92vw] bg-white rounded-2xl shadow-xl ring-1 ring-black/5 border border-gray-100 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-800">Choose template</h4>
                        <div className="text-xs text-gray-500">{templates.length} options</div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {templates.map(t => {
                            const active = selectedTemplate === t.id;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => { onChange(t.id); setIsOpen(false); }}
                                    className={`w-full text-left p-3 rounded-lg transition transform hover:-translate-y-0.5 ${active ? 'bg-sky-50 ring-1 ring-sky-200 border border-sky-100' : 'bg-white border border-gray-100 hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm font-medium text-gray-800">{t.name}</div>
                                                {active && (
                                                    <div className="flex items-center gap-1 text-sm text-sky-700">
                                                        <FaCheck size={14} />
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{t.preview}</p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="pt-1">
                        <button onClick={() => setIsOpen(false)} className="w-full text-sm text-gray-600 py-2 rounded-md hover:bg-gray-50 transition">Close</button>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default TemplateSelector;