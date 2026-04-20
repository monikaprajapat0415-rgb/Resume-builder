import React from 'react'
import Banner from '../components/home/Banner'
import Hero from '../components/home/Hero'
import Features from '../components/home/Features'
import Testimonials from '../components/home/Testimonials'
import CallToAction from '../components/home/CallToAction'
import Footer from '../components/home/Footer'
import WorkFlowSteps from '../components/home/WorkFlowSteps'
import TemplatePreview from '../components/home/TemplatePreview'
import ContactUs from './ContactUs'
import SEO from '../components/SEO'

const Home = () => {
  return (
   <div>
    <SEO
  title="Prime Resume AI – Free AI Resume Builder & CV Maker Online"
  description="Create professional resumes in minutes with AI. Choose modern, ATS-friendly templates and download your CV instantly. Free resume builder for freshers and professionals. Stand out with Prime Resume AI! "
/>

    <Banner />
    <Hero/>
    <WorkFlowSteps/>
    <Features/>
    <Testimonials/>
    <TemplatePreview/>
    <CallToAction/>
    <ContactUs/>
    <Footer/>
   </div>
  )
}

export default Home