import express, { type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';

const createTask = z.object({ title: z.string().trim().min(1) });
type NewTask = z.infer<typeof createTask>;                 // the TypeScript type comes FROM the schema

interface Task extends NewTask { id: number; done: boolean }
const tasks: Task[] = [];

const app = express();
app.use(express.json());

app.post('/tasks', (req: Request, res: Response) => {
  const parsed = createTask.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ errors: parsed.error.flatten().fieldErrors });
  const task: Task = { id: tasks.length + 1, done: false, ...parsed.data };
  tasks.push(task);
  res.status(201).json(task);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: 'Something went wrong' });
});

export default app;
