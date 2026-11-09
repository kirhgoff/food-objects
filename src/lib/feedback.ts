export const MESSAGE_MAX = 2000;
export const EMAIL_MAX = 254;

export type ParsedFeedback =
  | { ok: true; message: string; email: string | null }
  | { ok: false; error: string };

export function parseFeedback(form: FormData): ParsedFeedback {
  const message = String(form.get('message') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();
  if (!message) return { ok: false, error: 'Message is required' };
  if (message.length > MESSAGE_MAX) return { ok: false, error: 'Message is too long' };
  if (email.length > EMAIL_MAX) return { ok: false, error: 'Email is too long' };
  if (email && !email.includes('@')) return { ok: false, error: 'Email is invalid' };
  return { ok: true, message, email: email || null };
}
