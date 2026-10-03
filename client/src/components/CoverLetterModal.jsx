import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../configs/api'
import { LuX, LuMail, LuCopy, LuDownload } from 'react-icons/lu'
import { BiLoaderAlt } from 'react-icons/bi'

// Modal: generate a tailored cover letter from the current resume's data + a
// pasted job description. Result is editable and can be copied or downloaded as .txt.
const CoverLetterModal = ({ resumeId, onClose }) => {
  const { token } = useSelector(state => state.auth);
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [letter, setLetter] = useState('');

  const generate = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description first.');
      return;
    }
    setIsLoading(true);
    setLetter('');
    try {
      const { data } = await api.post('/api/ai/cover-letter', { resumeId, jobDescription, jobTitle, companyName }, { headers: { Authorization: token } });
      setLetter(data.coverLetter || '');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Could not generate cover letter. Please try again.');
    }
    setIsLoading(false);
  }

  const copyLetter = () => {
    navigator.clipboard.writeText(letter);
    toast.success('Copied to clipboard');
  }

  const downloadLetter = () => {
    const blob = new Blob([letter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cover-letter.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div onClick={onClose} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-20 flex items-center justify-center p-4'>
      <div onClick={(e) => e.stopPropagation()} className='relative bg-white border shadow-md rounded-lg w-full max-w-xl p-6 max-h-[85vh] overflow-y-auto'>
        <LuX className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick={onClose} />
        <h2 className='text-xl font-bold mb-1 flex items-center gap-2'>
          <LuMail className='size-5 text-green-600' />AI Cover Letter
        </h2>
        <p className='text-sm text-slate-500 mb-4'>Generate a tailored cover letter from this resume and a job description.</p>

        <form onSubmit={generate} className='space-y-3'>
          <div className='flex gap-3'>
            <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder='Job title (optional)' className='w-1/2 px-4 py-2 border rounded-md text-sm focus:border-green-600 focus:ring-green-600' />
            <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder='Company (optional)' className='w-1/2 px-4 py-2 border rounded-md text-sm focus:border-green-600 focus:ring-green-600' />
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder='Paste the job description here...'
            rows={5}
            className='w-full px-4 py-2 border rounded-md text-sm focus:border-green-600 focus:ring-green-600 resize-none'
          />
          <button disabled={isLoading} className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70'>
            {isLoading && <BiLoaderAlt className='size-4 animate-spin' />}
            {isLoading ? 'Writing...' : 'Generate Cover Letter'}
          </button>
        </form>

        {letter && (
          <div className='mt-6'>
            <textarea
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              rows={12}
              className='w-full px-4 py-3 border rounded-md text-sm focus:border-green-600 focus:ring-green-600'
            />
            <div className='flex gap-2 mt-3'>
              <button onClick={copyLetter} type='button' className='flex-1 flex items-center justify-center gap-2 py-2 border rounded-md text-sm hover:bg-slate-50 transition-colors'>
                <LuCopy className='size-4' />Copy
              </button>
              <button onClick={downloadLetter} type='button' className='flex-1 flex items-center justify-center gap-2 py-2 border rounded-md text-sm hover:bg-slate-50 transition-colors'>
                <LuDownload className='size-4' />Download .txt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoverLetterModal
