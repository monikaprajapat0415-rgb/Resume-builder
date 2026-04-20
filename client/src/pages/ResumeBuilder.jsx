import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import SEO from '../components/SEO'
import api from '../configs/api'
// import { LuArrowLeft, Briefcase, ChevronLast, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, LuFileText, GraduationCap, Share2Icon, Sparkles, User } from 'lucide-react';
import { LuArrowLeft,
LuBriefcase,
LuChevronLast,
LuChevronLeft,
LuChevronRight,
LuDownload,
LuEye,
LuEyeOff,
LuFileText,
LuFolder,
LuGraduationCap,
LuShare2,
LuSparkles,
LuUser
} from "react-icons/lu";
import PersonalInfoForm from '../components/PersonalInfoForm';
import ResumePreview from '../components/ResumePreview';
import TemplateSelector from '../components/TemplateSelector';
import ColorPicker from '../components/ColorPicker';
import ProfessinalSummaryForm from '../components/ProfessinalSummaryForm';
import ExperienceForm from '../components/ExperienceForm';
import EducationForm from '../components/EducationForm';
import ProjectForm from '../components/ProjectForm';
import SkillForm from '../components/SkillForm';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const ResumeBuilder = () => {
  const { resumeId } = useParams();

  const { token } = useSelector(state => state.auth);

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: '',
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: 'classic',
    accent_color: '#3B82F6',
    public: false
  })
  const loadExistingResume = async () => {

    try {
      const { data } = await api.get('/api/resumes/get/' + resumeId, { headers: { Authorization: token } });
      if (data.resume) {
        setResumeData(data.resume);
        document.title = `${data.resume.title} | Resume Builder`;
      } else {
        console.error("Resume not found");
      }
    } catch (error) {
      console.error("Error loading resume:", error.message);
    }
    // API call to load existing resume data and set it to state
  }
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);


  const sections = [
    { id: 'personal', name: 'Personal Information', icon: LuUser },
    { id: 'summary', name: 'Professional Summary', icon: LuFileText },
    { id: 'experience', name: 'Experience', icon: LuBriefcase },
    { id: 'education', name: 'Education', icon: LuGraduationCap },
    { id: 'project', name: 'Projects', icon: LuFileText },
    { id: 'skills', name: 'Skills', icon: LuSparkles },

  ]
  const activeSection = sections[activeSectionIndex]

  const validateSection = (index) => {
    const sectionId = sections[index].id;
    // basic validators
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^\+?[0-9]{10,13}$/;

    if (sectionId === 'personal') {
      const pi = resumeData.personal_info || {};
      if (!pi.full_name || !pi.full_name.trim()) {
        toast.error('Full name is required');
        return false;
      }
      if (!pi.email || !emailRegex.test((pi.email || '').trim())) {
        toast.error('Please enter a valid email address');
        return false;
      }
      if (!pi.phone || !phoneRegex.test((pi.phone || '').trim())) {
        toast.error('Please enter a valid phone number (10-13 digits, optional leading +)');
        return false;
      }
      return true;
    }

    if (sectionId === 'experience') {
      const exps = resumeData.experience || [];
      for (let i = 0; i < exps.length; i++) {
        const e = exps[i] || {};
        // if any data present in this experience, require company and position
        if ((e.company && e.company.trim()) || (e.position && e.position.trim()) || (e.start_date && e.start_date.trim()) || (e.end_date && e.end_date.trim()) || (e.description && e.description.trim())) {
          if (!e.company || !e.company.trim()) {
            toast.error(`Experience #${i + 1}: company is required`);
            return false;
          }
          if (!e.position || !e.position.trim()) {
            toast.error(`Experience #${i + 1}: position is required`);
            return false;
          }
        }
      }
      return true;
    }

    if (sectionId === 'education') {
      const eds = resumeData.education || [];
      for (let i = 0; i < eds.length; i++) {
        const ed = eds[i] || {};
        if ((ed.institution && ed.institution.trim()) || (ed.degree && ed.degree.trim()) || (ed.graduation_date && ed.graduation_date.trim())) {
          if (!ed.institution || !ed.institution.trim()) {
            toast.error(`Education #${i + 1}: institution is required`);
            return false;
          }
          if (!ed.degree || !ed.degree.trim()) {
            toast.error(`Education #${i + 1}: degree is required`);
            return false;
          }
        }
      }
      return true;
    }

    if (sectionId === 'project') {
      const projs = resumeData.project || [];
      for (let i = 0; i < projs.length; i++) {
        const p = projs[i] || {};
        if ((p.name && p.name.trim()) || (p.description && p.description.trim()) || (p.type && p.type.trim())) {
          if (!p.name || !p.name.trim()) {
            toast.error(`Project #${i + 1}: name is required`);
            return false;
          }
        }
      }
      return true;
    }

    // default: no validation
    return true;
  }

  useEffect(() => {
    loadExistingResume();
  }, [])

  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData();
      formData.append('resumeId', resumeData._id);
      formData.append('resumeData', JSON.stringify({ public: !resumeData.public }));
      // formData.append('removeBackground', removeBackground);
      const { data } = await api.put('/api/resumes/update', formData, { headers: { Authorization: token } });
      setResumeData({ ...resumeData, public: !resumeData.public })
      toast.success(data.message)

    } catch (error) {
      toast.error("Error saving resume:", error.message);
    }
  }

  const handleShare = () => {
    const frontendUrl = window.location.href.split('/app/')[0];
    const resumeUrl = frontendUrl + '/view/' + resumeId;

    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: 'My Resume', })

    } else {
      alert('Share not supported on this browser.')
    }
  }
  const downloadResume = () => {
    window.print();
  }
  const saveResume = async () => {
    try {
      let updatedResumeData = structuredClone(resumeData);

      //remove image from updatedRemsumeData
      if (typeof resumeData.personal_info.image === 'object') {
        delete updatedResumeData.personal_info.image;

      }

      const formData = new FormData();
      formData.append('resumeId', resumeId);
      formData.append('resumeData', JSON.stringify(updatedResumeData));
      removeBackground && formData.append('removeBackground', 'yes');

      typeof resumeData.personal_info.image === 'object' && formData.append('image', resumeData.personal_info.image);

      const { data } = await api.put('/api/resumes/update', formData, { headers: { Authorization: token } });

      setResumeData(data.resume)
      toast.success(data.message)

    } catch (error) {
      toast.error("Error saving resume:", error);
    }
  }


  return (
    <div>
      <SEO
        title="AI Resume Builder – Create ATS-Friendly Resume in Minutes | Prime Resume AI"
        description="Build a job-winning resume with AI. Generate, edit, and download ATS-friendly resumes instantly. No design skills needed. Fast, smart, and free."
      />
      <div className='max-w-7xl mx-auto px-4 py-6'>
        <Link to={'/app'} className='inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-all'>
          <LuArrowLeft className='size-4' />Back to Deshboard
        </Link>
      </div>
      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <div className='grid lg:grid-cols-12 gap-8'>
          {/* Left panel -- form */}
          <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
              {/* progress bar using activeSectionIndex */}
              <hr className='absolute top-0 left-0 h-1 bg-gradient-to-r
            from-green-500 to-green-600 border-none transition-all duration-2000'
                style={{ width: `${activeSectionIndex * 100 / (sections.length - 1)}%` }} />

              {/* Section Navigation */}
              <div className='flex items-center justify-between mb-6 border-b border-gray-300 py-1'>
                <div className='flex items-center gap-2'>
                  <TemplateSelector selectedTemplate={resumeData.template} isOpen={activeMenu === "template"} onChange={(template) => setResumeData(prev => ({ ...prev, template }))} />
                  <ColorPicker selectedColor={resumeData.accent_color} isOpen={activeMenu === "color"} onChange={(color) => setResumeData(prev => ({ ...prev, accent_color: color }))} />

                </div>
                <div className='flex item-center'>
                  {activeSectionIndex !== 0 && (
                    <button onClick={() => setActiveSectionIndex((prevIndex) => Math.max(prevIndex - 1, 0))}
                      className='flex items-center gap-1 p-3 rounded-lg text-sm
                   font-medium text-gray-600 hover:bg-gray-50 transition-all' disabled={activeSectionIndex === 0}>
                      <LuChevronLeft className='size-4' />
                      Previous
                    </button>
                  )}
                  <button onClick={() => {
                      // validate current section before moving next
                      if (validateSection(activeSectionIndex)) {
                        setActiveSectionIndex((prevIndex) => Math.min(prevIndex + 1, sections.length - 1));
                      }
                    }}
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium
                text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 && 'opacity-50'}`} disabled={activeSectionIndex === sections.length - 1}>
                    Next <LuChevronRight className='size-4' />
                  </button>
                </div>

              </div>

              {/* Form Content */}
              <div className='space-y-6'>
                {activeSection.id === 'personal' && (
                  <PersonalInfoForm data={resumeData.personal_info} onChange={(data) => setResumeData(prev => ({ ...prev, personal_info: data }))}
                    removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />
                )}
                {activeSection.id === 'summary' && (
                  <ProfessinalSummaryForm data={resumeData.professional_summary}
                    onChange={(data) => setResumeData(prev => ({ ...prev, professional_summary: data }))} setResumeData={setResumeData} />
                )}
                {activeSection.id === 'experience' && (
                  <ExperienceForm data={resumeData.experience}
                    onChange={(data) => setResumeData(prev => ({ ...prev, experience: data }))} />
                )}

                {activeSection.id === 'education' && (
                  <EducationForm data={resumeData.education}
                    onChange={(data) => setResumeData(prev => ({ ...prev, education: data }))} />
                )}
                {activeSection.id === 'project' && (
                  <ProjectForm data={resumeData.project}
                    onChange={(data) => setResumeData(prev => ({ ...prev, project: data }))} />
                )}

                {activeSection.id === 'skills' && (
                  <SkillForm data={resumeData.skills}
                    onChange={(data) => setResumeData(prev => ({ ...prev, skills: data }))} />
                )}
              </div>
              <button onClick={() => {toast.promise(saveResume, {
                loading: 'Saving...'})}}
                 className='bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm'>
                Save Changes

              </button>

            </div>

          </div>

          {/* Right panel -- resume preview */}
          <div className='lg:col-span-7 max-lg:mt-6'>
            <div className='relative w-full'>
              <div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2'>
                {resumeData.public && (
                  <button onClick={handleShare} className='flex items-center p-2 px-4 gap-2 text-xs
                  bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'>
                    <LuShare2 className='size-4' />Share
                  </button>)}

                <button onClick={changeResumeVisibility} className='flex items-center p-2 px-4 gap-2 text-xs
                  bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 rounded-lg ring-blue-300 hover:ring transition-colors'>
                  {resumeData.public ? <LuEye className='size-4' /> : <LuEyeOff className='size-4' />}
                  {resumeData.public ? 'Public' : 'Private'}
                </button>
                {/* Download button */}
                <button onClick={downloadResume} className='flex items-center p-2 px-4 gap-2 text-xs
                  bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-blue-300 hover:ring transition-colors'>
                  <LuDownload className='size-4' />Download
                </button>
              </div>


            </div>
            {/* resume preview */}
            <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />
          </div>
        </div>
      </div>

    </div>
  )
}

export default ResumeBuilder