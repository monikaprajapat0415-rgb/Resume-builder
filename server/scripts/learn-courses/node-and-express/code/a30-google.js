// Sign in with Google. NOT run in this course: it needs a Google Cloud OAuth client ID and a real token.
// Flow: the browser gets a Google ID token (with Google's button), sends it here, and we VERIFY it.
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(idToken) {
  const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  if (!payload?.email_verified) throw new Error('Google email is not verified');
  return { googleId: payload.sub, email: payload.email, name: payload.name };
}

// In your route: find a user by googleId or email (create one if needed), then issue YOUR OWN tokens.
// Never trust an email sent by the browser. Trust only what verifyIdToken returns.
