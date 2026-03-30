import React from 'react'

const Loader = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
      <div
        role="status"
        aria-label="Loading"
        className='w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin'
      />
    </div>
  )
}

export default Loader