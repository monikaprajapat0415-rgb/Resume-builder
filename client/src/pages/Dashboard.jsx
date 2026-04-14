// import { FilePenIcon, LoaderCircleIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloud, UploadCloudIcon, XIcon } from 'lucide-react'
// import React from 'react'
import {FaFileSignature,  } from 'react-icons/fa'
import { BiLoaderAlt } from 'react-icons/bi';
import { LuUpload, LuPlus, LuTrash2 , LuX,LuFileText } from 'react-icons/lu';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../configs/api'
import pdfToText from 'react-pdftotext'

const Dashboard = () => {

  const { user, token } = useSelector(state => state.auth);

  const colors = ["#9333EA", "#F43F5E", "#3B82F6", "#10B981", "#8B5CF6", "#EC4899", "#0EA5E9", "#14B8A6"]
  const [allResumes, setAllResumes] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)
  const [title, setTitle] = useState("")
  const [resume, setResume] = useState(null)
  const [editResumeId, setEditResumeId] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('')
  const [sortOption, setSortOption] = useState('newest')

  const navigate = useNavigate();

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get('/api/users/resumes', { headers: { Authorization: token } });
      setAllResumes(data.resumes);

    } catch (error) {
      console.error(error?.response?.data?.message || error.message || "An error occurred while fetching resumes.");
    }
  }

  const createResume = async (event) => {
    // event.preventDefault();
    // setShowCreateResume(false);
    // navigate(`/app/builder/res123`);
    try {
      event.preventDefault();
      const { data } = await api.post('/api/resumes/create', { title }, { headers: { Authorization: token } });
      setAllResumes([...allResumes, data.resume]);
      setTitle("");
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      // console.error("Error creating resume:", error);
      toast.error(error.response?.data?.message || error.message || "An error occurred. Please try again.")
    }

  }
  const uploadResume = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    // setShowUploadResume(false);
    // navigate(`/app/builder/res123`);
    try {
      const resumeText = await pdfToText(resume);
      const { data } = await api.post('/api/ai/upload-resume', { title, resumeText }, { headers: { Authorization: token } });
      setTitle("");
      setResume(null);
      setShowUploadResume(false);
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "An error occurred. Please try again.")
    }
    setIsLoading(false);
  }

  const editTitle = async (event) => {
    try {
      event.preventDefault();
      const { data } = await api.put(`/api/resumes/update/`, { resumeId: editResumeId, resumeData: { title } }, { headers: { Authorization: token } });
      setAllResumes(allResumes.map(resume => resume._id === editResumeId ? { ...resume, title } : resume));
      setTitle("");
      setEditResumeId("");
      toast.success(data.message || "Resume title updated successfully.")

    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "An error occurred. Please try again.")
    }
    setEditResumeId("");
  }
  const deleteResume = async (resumeId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this resume?");
      if (confirmDelete) {
        const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, { headers: { Authorization: token } });
        setAllResumes(allResumes.filter(resume => resume._id !== resumeId));
        toast.success(data.message || "Resume deleted successfully.")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "An error occurred. Please try again.")
    }
  }
  useEffect(() => {
    loadAllResumes();
  }, [])
  // derive filtered + sorted list in JS for simpler JSX
  const q = query.trim().toLowerCase()
  let filteredResumes = allResumes.filter(r => r.title?.toLowerCase().includes(q) || !q)
  if (sortOption === 'newest') filteredResumes = filteredResumes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  if (sortOption === 'oldest') filteredResumes = filteredResumes.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
  if (sortOption === 'title_asc') filteredResumes = filteredResumes.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
  if (sortOption === 'title_desc') filteredResumes = filteredResumes.sort((a, b) => (b.title || '').localeCompare(a.title || ''))
  // compute number of distinct templates used across resumes
  const templateCount = new Set(allResumes.map(r => (r.template || 'classic'))).size
  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-6 relative'>
        {/* soft green background shard */}
        <div className='absolute top-12 -z-10 right-1/4 rounded-full size-72 sm:size-96 bg-green-300 blur-[100px] opacity-25 transform rotate-12'></div>
        {/* Header: greeting, summary stats and CTAs */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6'>
          <div>
            <h1 className='text-3xl font-semibold text-slate-800'>
              Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
            </h1>
            <p className='text-sm text-slate-500 mt-1'>Manage your resumes and export them to PDF.</p>
            <div className='mt-3 flex items-center gap-3'>
              <div className='bg-slate-50 px-3 py-1 rounded-md text-sm text-slate-700'>
                <strong className='mr-1'>{allResumes.length}</strong> resumes
              </div>
              <div className='bg-slate-50 px-3 py-1 rounded-md text-sm text-slate-700'>
                <strong className='mr-1'>{templateCount}</strong> templates used
              </div>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto'>
            <div className='flex items-center gap-3'>
              <button onClick={() => setShowCreateResume(true)} className='flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-sm transition'>
                <LuPlus className='size-4' />
                Create
              </button>
              <button onClick={() => setShowUploadResume(true)} className='flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-full hover:bg-slate-50 transition'>
                <LuUpload className='size-4' />
                Upload
              </button>
            </div>

            {/* Search & sort */}
            <div className='flex items-center gap-2 mt-3 sm:mt-0'>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Search resumes...' className='px-3 py-2 border rounded-md text-sm w-48 focus:ring-1 focus:ring-indigo-200' />
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className='text-sm border rounded-md px-2 py-2'>
                <option value='newest'>Newest</option>
                <option value='oldest'>Oldest</option>
                <option value='title_asc'>Title A→Z</option>
                <option value='title_desc'>Title Z→A</option>
              </select>
            </div>
          </div>
        </div>

        <hr className='border-slate-200 my-6' />

        {allResumes.length === 0 ? (
          <div className='rounded-lg border border-dashed border-slate-200 p-10 text-center text-slate-500'>
            <p className='mb-3 text-lg text-slate-700'>No resumes yet</p>
            <p className='mb-6'>Start by creating a new resume or upload an existing PDF.</p>
            <div className='flex items-center justify-center gap-3'>
              <button onClick={() => setShowCreateResume(true)} className='px-4 py-2 bg-green-600 text-white rounded-md'>Create resume</button>
              <button onClick={() => setShowUploadResume(true)} className='px-4 py-2 border rounded-md'>Upload PDF</button>
            </div>
          </div>
        ) : filteredResumes.length === 0 ? (
          <div className='rounded-lg border border-slate-200 p-8 text-center text-slate-600'>
            <p className='mb-2'>No resumes match "{query}"</p>
            <p className='text-sm text-slate-500'>Try a different search or clear the filter.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {filteredResumes.map((resume, index) => {
              const baseColor = colors[index % colors.length];
              return (
                <div key={resume._id} className='relative group bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition cursor-pointer' onClick={() => navigate(`/app/builder/${resume._id}`)}>
                  <div className='flex items-start justify-between gap-3'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-md flex items-center justify-center' style={{ background: `${baseColor}20` }}>
                        <LuFileText className='text-lg' style={{ color: baseColor }} />
                      </div>
                      <div className='min-w-0'>
                        <p className='font-medium text-slate-800 truncate'>{resume.title || 'Untitled resume'}</p>
                        <p className='text-xs text-slate-500'>Updated {new Date(resume.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div onClick={(e) => e.stopPropagation()} className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition'>
                      <button onClick={() => { setEditResumeId(resume._id); setTitle(resume.title) }} aria-label='Edit title' className='p-2 rounded-md hover:bg-slate-100 transition'>
                        <FaFileSignature className='size-4 text-slate-600' />
                      </button>
                      <button onClick={() => deleteResume(resume._id)} aria-label='Delete resume' className='p-2 rounded-md hover:bg-slate-100 transition'>
                        <LuTrash2 className='size-4 text-red-500' />
                      </button>
                    </div>
                  </div>

                  <div className='mt-4 flex items-center justify-between'>
                    <div className='text-xs text-slate-500'>
                      {resume.public ? (
                        <span className='inline-flex items-center gap-2 text-green-600 font-medium text-xs'>
                          {/* small public badge */}
                          <svg width='10' height='10' viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg' className='inline-block'>
                            <circle cx='5' cy='5' r='5' fill='#10B981' />
                          </svg>
                          Public
                        </span>
                      ) : (
                        <span className='text-xs text-slate-400'>Private</span>
                      )}
                    </div>
                    <div className='text-xs space-x-2 flex items-center'>
                      {resume.public && (
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/view/${resume._id}`) }} className='px-3 py-1 text-xs border rounded-md hover:bg-slate-50 transition'>Preview</button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {showCreateResume && (
          <form onSubmit={createResume} onClick={() => { setShowCreateResume(false); setTitle('') }} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div onClick={(e) => { e.stopPropagation() }} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
              <h2 className='text-xl font-bold mb-4'>
                Create Resume
              </h2>
              <input onChange={(e) => setTitle(e.target.value)} value={title} type='text' placeholder='Enter rasume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required />
              <button className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>
                Create Resume
              </button>
              <LuX className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors'
                onClick={() => { setShowCreateResume(false); setTitle('') }} />

            </div>
          </form>
        )}
        {showUploadResume && (
          <form onSubmit={uploadResume} onClick={() => { setShowUploadResume(false); setTitle('') }} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div onClick={(e) => { e.stopPropagation() }} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
              <h2 className='text-xl font-bold mb-4'>
                Upload Resume
              </h2>
              <input onChange={(e) => setTitle(e.target.value)} value={title} type='text' placeholder='Enter rasume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required />
              <div>
                <label htmlFor='resume-input' className='block text-sm text-slate-700'>Select Resume file
                  <div className='flex flex-col items-center justify-center gap-2
                border group test-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500
                hover:text-green700 cursor-pointer transition-colors'>
                    {resume ? (
                      <p className='text-green-700'>{resume.name}</p>
                    ) : (<>
                      <LuUpload className='size-14 stroke-1' />
                      <p>Upload resume</p>
                    </>)}

                  </div>
                </label>
                <input type='file' id='resume-input' accept='.pdf' hidden
                  onChange={(e) => setResume(e.target.files[0])} />
              </div>
              <button disabled={isLoading} className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2'>
                {isLoading && <BiLoaderAlt className='size-4 animate-spin text-white' />}
                {isLoading ? "Uploading..." : "Upload Resume"}

              </button>
              <LuX className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors'
                onClick={() => { setShowUploadResume(false); setTitle('') }} />

            </div>
          </form>)
        }
        {/* Edit resume */}
        {editResumeId && (
          <form onSubmit={editTitle} onClick={() => { setEditResumeId('') }} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div onClick={(e) => { e.stopPropagation() }} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
              <h2 className='text-xl font-bold mb-4'>
                Edit Resume Title
              </h2>
              <input onChange={(e) => setTitle(e.target.value)} value={title} type='text' placeholder='Enter rasume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required />
              <button className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>
                Update
              </button>
              <LuX className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors'
                onClick={() => { setEditResumeId(''); setTitle('') }} />

            </div>
          </form>
        )}




      </div>
    </div>
  )
}

export default Dashboard