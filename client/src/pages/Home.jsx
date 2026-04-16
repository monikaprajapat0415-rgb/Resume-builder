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

const Home = () => {
  return (
   <div>
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