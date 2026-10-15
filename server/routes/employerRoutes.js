import express from 'express'
import protect from '../middlewares/authMiddleware.js'
import { employerLimiter } from '../middlewares/rateLimiter.js'
import { needEmployer, applyEmployer, myEmployer, updateEmployer, myJobs, createJob, updateJob, setJobActive, deleteJob } from '../controllers/employerController.js'
import { searchTalent, contactTalent, sentRequests, withdrawRequest } from '../controllers/talentController.js'

// Companies: apply, then (once an admin approves) search available candidates, contact them and post jobs.
const employerRouter = express.Router()
employerRouter.post('/', protect, employerLimiter, applyEmployer)
employerRouter.get('/me', protect, myEmployer)
employerRouter.put('/me', protect, employerLimiter, updateEmployer)

employerRouter.get('/talent', protect, needEmployer, employerLimiter, searchTalent)
employerRouter.post('/talent/:publicId/contact', protect, needEmployer, employerLimiter, contactTalent)
employerRouter.get('/requests', protect, needEmployer, sentRequests)
employerRouter.post('/requests/:id/withdraw', protect, needEmployer, withdrawRequest)

employerRouter.get('/jobs', protect, needEmployer, myJobs)
employerRouter.post('/jobs', protect, needEmployer, employerLimiter, createJob)
employerRouter.put('/jobs/:id', protect, needEmployer, employerLimiter, updateJob)
employerRouter.patch('/jobs/:id', protect, needEmployer, setJobActive)
employerRouter.delete('/jobs/:id', protect, needEmployer, deleteJob)
export default employerRouter
