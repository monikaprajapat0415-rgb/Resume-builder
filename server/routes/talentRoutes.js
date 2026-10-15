import express from 'express'
import protect from '../middlewares/authMiddleware.js'
import { getMyTalent, saveMyTalent, deleteMyTalent, myRequests, respondRequest } from '../controllers/talentController.js'

// Job seekers: manage their "open to work" profile and answer company requests.
const talentRouter = express.Router()
talentRouter.get('/me', protect, getMyTalent)
talentRouter.put('/me', protect, saveMyTalent)
talentRouter.delete('/me', protect, deleteMyTalent)
talentRouter.get('/me/requests', protect, myRequests)
talentRouter.post('/me/requests/:id/respond', protect, respondRequest)
export default talentRouter
