import User from '../models/User.js';
import { getPlanSettings, isPaidUser } from '../controllers/planController.js';

// Put after `protect`. While the paid plan is OFF (the default) or this feature is not ticked, it does nothing.
// Admins and users with an active plan pass. If settings cannot be read, we let the request through (fail open).
export const requirePlanFor = (feature) => async (req, res, next) => {
    try {
        const s = await getPlanSettings();
        if (!s.enabled || !s.gates?.[feature]) return next();
        const user = await User.findById(req.userId).select('role planUntil');
        if (isPaidUser(user)) return next();
        return res.status(402).json({ code: 'PLAN_REQUIRED', feature, pricingUrl: '/pricing', message: `This feature is part of the ${s.planName} plan.` });
    } catch (e) { return next(); }
};
