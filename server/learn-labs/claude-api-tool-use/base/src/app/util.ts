// Turn any HTTP error into one friendly sentence for the screen.
export function errorText(e: unknown): string {
  const err = e as { error?: { error?: { message?: string } }; message?: string };
  return err?.error?.error?.message || 'Something went wrong. Please try again.';
}
