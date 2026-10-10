import React from 'react'
// import { Zap } from 'lucide-react'  
import { Link } from 'react-router-dom';
import { LuZap, LuScanSearch, LuSparkles, LuMailPlus } from 'react-icons/lu';
import Title from './Title';


const Features = () => {
     const [isHover, setIsHover] = React.useState(false);

  return (
   <div id='feature' className='flex flex-col items-center my-10 scroll-mt-12'>

     <div className="flex items-center gap-2 text-sm text-brand-600 bg-brand-400/10 rounded-full px-6 py-1.5">
            <LuZap width={14}/>
            <span>Simple process</span>
        </div>
        <Title title='Buid your resume' desciption='Our stremlined process helps you create a professional resume in minutes with intelligent AI-powered tools and features.'/>

            <div className="flex flex-col md:flex-row items-center justify-center xl:-mt-10">
                <img className="max-w-2xl w-full xl:-ml-32" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png" alt="Prime Resume AI dashboard showing resume templates and editing tools" />
                <div className="px-4 md:px-0" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
                    <Link to="/features/ats-checker" className={"flex items-center justify-center gap-6 max-w-md group"}>
                        <div className={`p-6 group-hover:bg-violet-100 border border-transparent group-hover:border-violet-300 flex gap-4 rounded-xl transition-colors ${!isHover ? 'border-violet-300 bg-violet-100' : ''}`}>
                            <LuScanSearch className="size-6 shrink-0 text-violet-600" />
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-slate-700">Free ATS Resume Checker <span className="ml-1 text-[10px] uppercase bg-brand-600 text-white rounded-full px-2 py-0.5 align-middle">Free</span></h3>
                                <p className="text-sm text-slate-600 max-w-xs">Drop your resume and get an ATS score with a full report on what to improve.</p>
                            </div>
                        </div>
                    </Link>
                    <Link to="/features" className="flex items-center justify-center gap-6 max-w-md group">
                        <div className="p-6 group-hover:bg-brand-100 border border-transparent group-hover:border-brand-300 flex gap-4 rounded-xl transition-colors">
                            <LuSparkles className="size-6 shrink-0 text-brand-600" />
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-slate-700">AI Writing Help</h3>
                                <p className="text-sm text-slate-600 max-w-xs">Polish your summary and turn job duties into achievement-focused bullet points.</p>
                            </div>
                        </div>
                    </Link>
                    <Link to="/features" className="flex items-center justify-center gap-6 max-w-md group">
                        <div className="p-6 group-hover:bg-orange-100 border border-transparent group-hover:border-orange-300 flex gap-4 rounded-xl transition-colors">
                            <LuMailPlus className="size-6 shrink-0 text-orange-600" />
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-slate-700">AI Cover Letters</h3>
                                <p className="text-sm text-slate-600 max-w-xs">Generate a tailored cover letter for each job from your resume details.</p>
                            </div>
                        </div>
                    </Link>
                    <Link to="/features" className="block text-center text-sm font-medium text-brand-700 hover:underline mt-3">See all features →</Link>
                </div>
            </div>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
        </div>
  )
}

export default Features