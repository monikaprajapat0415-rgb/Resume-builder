import { z } from 'zod';

// One schema describes the shape, the rules and the type of the data.
export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name needs at least 2 letters'),
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z.string().min(8, 'Password needs at least 8 characters'),
  age: z.coerce.number().int().min(18, 'You must be 18 or older').optional(),   // coerce turns "25" into 25
});

// A reusable Express middleware: validate the body, replace it with the cleaned result.
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = Object.fromEntries(result.error.issues.map((i) => [i.path.join('.'), i.message]));
    return res.status(422).json({ errors });
  }
  req.body = result.data;
  next();
};
