import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../configs/api'
import { LuX, LuTarget } from 'react-icons/lu'
import { BiLoaderAlt } from 'react-icons/bi'

// Modal: paste a job description, get an AI-generated ATS match score for the
// currently open resume, plus matched/missing keywords and suggestions.
const AtsScoreModal = ({ resumeId, onClose }) => {
  const { token } = useSelector(state => state.auth);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const scoreColor = (score) => {
    if (score >= 80) return 'text-green-600 ring-green-200 from-green-50 to-green-100';
    if (score >= 50) return 'text-amber-600 ring-amber-200 from-amber-50 to-amber-100';
    return 'text-red-600 ring-red-200 from-red-50 to-red-100';
  }

  const checkScore = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description first.');
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const { data } = await api.post('/api/ai/ats-score', { resumeId, jobDescription }, { headers: { Authorization: token } });
      setResult(data.result);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Could not check ATS score. Please try again.');
    }
    setIsLoading(false);
  }

  return (
    <div onClick={onClose} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-20 flex items-center justify-center p-4'>
      <div onClick={(e) => e.stopPropagation()} className='relative bg-white border shadow-md rounded-lg w-full max-w-xl p-6 max-h-[85vh] overflow-y-auto'>
        <LuX className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick={onClose} />
        <h2 className='text-xl font-bold mb-1 flex items-center gap-2'>
          <LuTarget className='size-5 text-brand-600' />ATS Score Checker
        </h2>
        <p className='text-sm text-slate-500 mb-4'>Paste a job description to see how well this resume matches it.</p>

        <form onSubmit={checkScore}>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder='Paste the job description here...'
            rows={6}
            className='w-full px-4 py-2 mb-3 border rounded-md text-sm focus:border-brand-600 focus:ring-brand-600 resize-none'
          />
          <button disabled={isLoading} className='w-full py-2 bg-brand-600 text-white rounded hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70'>
            {isLoading && <BiLoaderAlt className='size-4 animate-spin' />}
            {isLoading ? 'Analyzing...' : 'Check ATS Score'}
          </button>
        </form>

        {result && (
          <div className='mt-6 space-y-4'>
            <div className={`flex items-center gap-4 rounded-lg ring p-4 bg-gradient-to-br ${scoreColor(result.score)}`}>
              <div className='text-4xl font-bold'>{result.score}</div>
              <div className='text-sm'>
                <p className='font-medium'>Match Score / 100</p>
                <p className='text-xs opacity-80'>{result.score >= 80 ? 'Strong match' : result.score >= 50 ? 'Moderate match - some gaps to close' : 'Weak match - significant gaps'}</p>
              </div>
            </div>

            {result.matchedKeywords?.length > 0 && (
              <div>
                <p className='text-sm font-medium text-slate-700 mb-2'>Keywords found in your resume</p>
                <div className='flex flex-wrap gap-2'>
                  {result.matchedKeywords.map((kw, i) => (
                    <span key={i} className='text-xs px-2 py-1 rounded-full bg-brand-50 text-brand-700 ring-1 ring-brand-200'>{kw}</span>
                  ))}
                </div>
              </div>
            )}

            {result.missingKeywords?.length > 0 && (
              <div>
                <p className='text-sm font-medium text-slate-700 mb-2'>Missing keywords</p>
                <div className='flex flex-wrap gap-2'>
                  {result.missingKeywords.map((kw, i) => (
                    <span key={i} className='text-xs px-2 py-1 rounded-full bg-red-50 text-red-700 ring-1 ring-red-200'>{kw}</span>
                  ))}
                </div>
              </div>
            )}

            {result.suggestions?.length > 0 && (
              <div>
                <p className='text-sm font-medium text-slate-700 mb-2'>Suggestions</p>
                <ul className='list-disc list-inside space-y-1 text-sm text-slate-600'>
                  {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AtsScoreModal
