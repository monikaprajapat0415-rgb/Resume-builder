// Controllers hold the logic of each route. For now the "database" is an array in memory,
// so the data vanishes when the server restarts. Lesson 17 replaces it with MongoDB.
let nextId = 3;
const jobs = [
  { id: 1, company: 'Northwind Bank', role: 'Teller', status: 'applied' },
  { id: 2, company: 'Acme Logistics', role: 'Dispatcher', status: 'interview' },
];

export const listJobs = (req, res) => res.json(jobs);

export const getJob = (req, res) => {
  const job = jobs.find((j) => j.id === Number(req.params.id));
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json(job);
};

export const createJob = (req, res) => {
  const { company, role, status = 'saved' } = req.body;
  const job = { id: nextId++, company, role, status };
  jobs.push(job);
  res.status(201).json(job);
};

export const updateJob = (req, res) => {
  const job = jobs.find((j) => j.id === Number(req.params.id));
  if (!job) return res.status(404).json({ message: 'Job not found' });
  Object.assign(job, req.body);
  res.json(job);
};

export const deleteJob = (req, res) => {
  const index = jobs.findIndex((j) => j.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Job not found' });
  jobs.splice(index, 1);
  res.status(204).end();
};
