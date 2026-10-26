import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Banner from '../components/home/Banner'
import Hero from '../components/home/Hero'
import Features from '../components/home/Features'
import JobsSection from '../components/home/JobsSection'
import Testimonials from '../components/home/Testimonials'
import CallToAction from '../components/home/CallToAction'
import Footer from '../components/home/Footer'
import WorkFlowSteps from '../components/home/WorkFlowSteps'
import TemplatePreview from '../components/home/TemplatePreview'
import CareerHub from '../components/home/CareerHub'
import HomeFaq, { faqJsonLd, faqFrom } from '../components/home/HomeFaq'
import ContactUs from './ContactUs'
import CountryBar from '../i18n/CountryBar'
import TrustStats from '../components/home/TrustStats'
import ClientsStrip from '../components/home/ClientsStrip'
import ReviewsSection from '../components/home/ReviewsSection'
import Reveal from '../components/Reveal'
import ScrollProgress from '../components/ScrollProgress'
import SEO from '../components/SEO'
import { useSiteContent } from '../utils/siteContent'

const Home = () => {
  const location = useLocation()
  const faq = faqFrom(useSiteContent())

  // Reached via a nav link like "/#feature" (e.g. clicked from /blog, where the
  // section doesn't exist on the page). Scroll to it once Home has mounted.
  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.slice(1)
    const scrollToId = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    // Give the page layout a tick to settle before measuring scroll position.
    const timer = setTimeout(scrollToId, 100)
    return () => clearTimeout(timer)
  }, [location.hash])

  return (
   <div className="overflow-x-clip">
    <SEO
  title="Prime Resume AI – Free AI Resume Builder & CV Maker Online"
  description="Create professional resumes in minutes with AI. Choose modern, ATS-friendly templates and download your CV instantly. Free resume builder for freshers and professionals. Stand out with Prime Resume AI! "
  keywords="resume builder, AI resume builder, free resume maker, CV generator, ATS friendly resume"
  path="/"
  structuredData={faq.length ? faqJsonLd(faq) : undefined}
/>

    <ScrollProgress />
    <Banner />
    <CountryBar />
    <Hero/>
    <TrustStats/>
    <ClientsStrip/>
    <Reveal><WorkFlowSteps/></Reveal>
    <Reveal><Features/></Reveal>
    <Reveal><JobsSection/></Reveal>
    <Reveal><CareerHub/></Reveal>
    <Reveal><Testimonials/></Reveal>
    <ReviewsSection/>
    <Reveal><TemplatePreview/></Reveal>
    <Reveal><HomeFaq/></Reveal>
    <Reveal><CallToAction/></Reveal>
    <ContactUs embedded />
    <Footer/>
   </div>
  )
}

export default Home