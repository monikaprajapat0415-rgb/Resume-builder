import { EXAMPLES, getExample, exampleSummary } from '../utils/exampleResumes.js';
import { EXAMPLES_HOW } from '../utils/exampleSeo.js';

// GET /api/examples
export const listExamples = (req, res) => {
    res.set('Cache-Control', 'public, max-age=300');
    return res.status(200).json({ examples: EXAMPLES.map(exampleSummary), how: EXAMPLES_HOW });
};

// GET /api/examples/:slug
export const getExampleBySlug = (req, res) => {
    const e = getExample(req.params.slug);
    if (!e) return res.status(404).json({ message: 'Example not found' });
    res.set('Cache-Control', 'public, max-age=300');
    const others = EXAMPLES.filter((x) => x.slug !== e.slug).map(exampleSummary);
    return res.status(200).json({ example: e, others });
};
