import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

const OFFER = [
  ['Resume and CV builder', '/app', 'Pick a template, fill in your details and download a clean, ATS-friendly resume.'],
  ['ATS checker', '/features/ats-checker', 'See how a resume reads to an applicant tracking system and what to fix.'],
  ['Free courses', '/learn', 'Step-by-step lessons on programming and career skills, in plain language.'],
  ['Interview questions', '/jobs/interview-questions', 'Questions with model answers, grouped by technology, plus answers shared by other job seekers.'],
  ['Career roadmaps', '/roadmaps', 'The steps for a job or technology, in order, with places to learn each one.'],
  ['Jobs, salaries and company reviews', '/jobs', 'Job listings, and pay and review pages built from what real people share.'],
]

const About = () => (
  <section className='bg-gray-50 py-14'>
    <div className='site-w'>
      <SEO title='About Prime Resume AI' description='Prime Resume AI helps people write better resumes, learn job skills and prepare for interviews. See what we offer and how we keep our content honest.' path='/about' />
      <div className='mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-lg space-y-8'>
        <div>
          <h1 className='text-3xl font-bold text-slate-800'>About Prime Resume AI</h1>
          <p className='mt-3 text-slate-600'>Prime Resume AI is a website for people who are looking for work or learning a new skill. We help you write a resume that is easy for employers and applicant tracking systems to read, learn job skills for free, and practise for interviews.</p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-slate-800'>What you can do here</h2>
          <ul className='mt-3 space-y-3'>
            {OFFER.map(([name, to, text]) => (
              <li key={to}><Link to={to} className='font-medium text-brand-700 hover:underline'>{name}</Link><span className='text-slate-600'> – {text}</span></li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-slate-800'>How we keep it honest</h2>
          <ul className='mt-3 list-disc space-y-2 pl-5 text-slate-600'>
            <li>We do not promise you a job, an interview or a salary. A good resume improves your chances; it does not decide the result.</li>
            <li>Sample resumes, messages and numbers in our lessons are made up, and we say so.</li>
            <li>Salary ranges and company ratings appear only when enough people have shared the same kind of report, and every shared answer, salary and review is read before it is published.</li>
            <li>Interview answers are models to adapt in your own words, not scripts to memorise.</li>
          </ul>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-slate-800'>Get in touch</h2>
          <p className='mt-3 text-slate-600'>Found a mistake, have a question or want to suggest a topic? Use the <Link to='/contact-us' className='text-brand-700 hover:underline'>contact form</Link>. See also our <Link to='/privacy-policy' className='text-brand-700 hover:underline'>privacy policy</Link> and <Link to='/terms-and-conditions' className='text-brand-700 hover:underline'>terms</Link>.</p>
        </div>
      </div>
    </div>
  </section>
)
export default About
