import React, { useEffect, useRef } from 'react'
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
LuUser,
LuTarget,
LuMail,
LuPrinter,
} from "react-icons/lu";
import { BiLoaderAlt } from 'react-icons/bi';
import PersonalInfoForm from '../components/PersonalInfoForm';
import ResumePreview from '../components/ResumePreview';
import TemplateSelector from '../components/TemplateSelector';
import ColorPicker from '../components/ColorPicker';
import ProfessinalSummaryForm from '../components/ProfessinalSummaryForm';
import ExperienceForm from '../components/ExperienceForm';
import EducationForm from '../components/EducationForm';
import ProjectForm from '../components/ProjectForm';
import SkillForm from '../components/SkillForm';
import AtsScoreModal from '../components/AtsScoreModal';
import CoverLetterModal from '../components/CoverLetterModal';
import { useSiteContent } from '../utils/siteContent';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ResumeBuilder = () => {
  // The admin turns the Cover Letter button on or off from Admin > Appearance (off by default).
  const site = useSiteContent();
  const coverLetterEnabled = site.feature_cover_letter === 'true';
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
        lastSyncedRef.current = JSON.stringify(data.resume);
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
  const [showAtsModal, setShowAtsModal] = useState(false);
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedLabel, setLastSavedLabel] = useState('');

  // Tracks the JSON snapshot of the last version we know is synced with the server
  // (either just loaded, or just saved). Autosave only fires when the current data
  // actually differs from this, so it never fires right after a load/save.
  const lastSyncedRef = useRef(null);
  const autosaveTimerRef = useRef(null);


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

  const downloadPdf = async () => {
    const element = document.getElementById('resume-preview');
    if (!element) {
      toast.error('Could not find the resume preview to export.');
      return;
    }
    setIsDownloadingPdf(true);
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Paginate: if the resume is taller than one page, keep shifting the same
      // image up and adding new pages until we've covered the full height.
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `${(resumeData.personal_info?.full_name || resumeData.title || 'resume').replace(/[^a-z0-9]+/gi, '_')}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('Could not generate the PDF. Try the Print option instead.');
    }
    setIsDownloadingPdf(false);
  }

  // Shared save logic used by both the manual "Save Changes" button and autosave.
  // `silent` suppresses the success toast so autosave doesn't spam notifications.
  const performSave = async (silent = false) => {
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
    lastSyncedRef.current = JSON.stringify(data.resume);
    if (!silent) {
      toast.success(data.message)
    }
    return data;
  }

  const saveResume = async () => {
    try {
      await performSave(false);
    } catch (error) {
      toast.error("Error saving resume:", error);
    }
  }

  // Autosave: whenever resumeData changes and genuinely differs from the last
  // synced version, save it in the background ~2.5s after the last edit.
  useEffect(() => {
    if (!resumeData._id) return; // resume hasn't loaded yet
    const currentSnapshot = JSON.stringify(resumeData);
    if (lastSyncedRef.current === null) {
      lastSyncedRef.current = currentSnapshot;
      return;
    }
    if (currentSnapshot === lastSyncedRef.current) return; // nothing actually changed

    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        await performSave(true);
        setLastSavedLabel(`Saved ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      } catch (error) {
        // stay quiet on autosave failures so we don't interrupt typing; the
        // manual Save button still works and will surface the real error.
        console.error('Autosave failed:', error.message);
      }
      setIsSaving(false);
    }, 2500);

    return () => clearTimeout(autosaveTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeData])


  return (
    <div>
      <SEO
        title="AI Resume Builder – Create ATS-Friendly Resume in Minutes"
        description="Build a job-winning resume with AI. Generate, edit, and download ATS-friendly resumes instantly. No design skills needed. Fast, smart, and free."
        noindex
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
            from-brand-500 to-brand-600 border-none transition-all duration-2000'
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
                 className='bg-gradient-to-br from-brand-100 to-brand-200 ring-brand-300 text-brand-600 ring hover:ring-brand-400 transition-all rounded-md px-6 py-2 mt-6 text-sm'>
                Save Changes

              </button>
              <span className='ml-3 text-xs text-slate-400 align-middle'>
                {isSaving ? 'Saving...' : lastSavedLabel}
              </span>

            </div>

          </div>

          {/* Right panel -- resume preview */}
          <div className='lg:col-span-7 max-lg:mt-6'>
            <div className='relative w-full'>
              <div className='absolute bottom-3 left-0 right-0 flex flex-wrap items-center justify-end gap-2'>
                <button onClick={() => setShowAtsModal(true)} className='flex items-center p-2 px-4 gap-2 text-xs
                  bg-gradient-to-br from-teal-100 to-teal-200 text-teal-700 rounded-lg ring-teal-300 hover:ring transition-colors'>
                  <LuTarget className='size-4' />ATS Score
                </button>
                {coverLetterEnabled && (
                  <button onClick={() => setShowCoverLetterModal(true)} className='flex items-center p-2 px-4 gap-2 text-xs
                  bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 rounded-lg ring-indigo-300 hover:ring transition-colors'>
                    <LuMail className='size-4' />Cover Letter
                  </button>
                )}
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
                {/* Print fallback (browser print-to-PDF) */}
                <button onClick={downloadResume} title='Print / browser Save as PDF' className='flex items-center p-2 px-4 gap-2 text-xs
                  bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 rounded-lg ring-gray-300 hover:ring transition-colors'>
                  <LuPrinter className='size-4' />Print
                </button>
                {/* Real one-click PDF export */}
                <button onClick={downloadPdf} disabled={isDownloadingPdf} className='flex items-center p-2 px-4 gap-2 text-xs
                  bg-gradient-to-br from-brand-100 to-brand-200 text-brand-600 rounded-lg ring-blue-300 hover:ring transition-colors disabled:opacity-60'>
                  {isDownloadingPdf ? <BiLoaderAlt className='size-4 animate-spin' /> : <LuDownload className='size-4' />}
                  {isDownloadingPdf ? 'Generating...' : 'Download PDF'}
                </button>
              </div>


            </div>
            {/* resume preview */}
            <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />
          </div>
        </div>
      </div>

      {showAtsModal && (
        <AtsScoreModal resumeId={resumeData._id} onClose={() => setShowAtsModal(false)} />
      )}
      {coverLetterEnabled && showCoverLetterModal && (
        <CoverLetterModal resumeId={resumeData._id} onClose={() => setShowCoverLetterModal(false)} />
      )}

    </div>
  )
}

export default ResumeBuilder
