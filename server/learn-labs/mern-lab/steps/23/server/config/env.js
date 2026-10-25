// Lesson 23: fail at startup, with a clear message, instead of failing later in a confusing way.
const required = ['MONGODB_URI', 'JWT_SECRET'];

export function checkEnv() {
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) throw new Error(`Missing environment variables: ${missing.join(', ')}. Copy .env.example to .env.`);
  const production = process.env.NODE_ENV === 'production';
  if (production && process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be at least 32 characters in production');
  if (production && /change-me/i.test(process.env.JWT_SECRET)) throw new Error('JWT_SECRET is still the example value');
}
