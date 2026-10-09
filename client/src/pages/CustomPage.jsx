import React from 'react'
import { useParams, Link } from 'react-router-dom'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import CmsPage from '../components/CmsPage'
import SEO from '../components/SEO'

const NotFound = () => (
  <section className='py-24 px-4 text-center'>
    <SEO title='Page not found' noindex />
    <h1 className='text-2xl font-semibold text-slate-800'>Page not found</h1>
    <Link to='/' className='text-green-600 hover:underline text-sm mt-3 inline-block'>Back to home</Link>
  </section>
)

const CustomPage = () => {
  const { slug } = useParams()
  return (
    <>
      <NavBar />
      <CmsPage key={slug} slug={slug} onMissing={<NotFound />} fallback={null} />
      <Footer />
    </>
  )
}
export default CustomPage
