export const MESSAGE_MAX = 2000;
export const EMAIL_MAX = 254;
export const BODY_MAX = 16 * 1024;
export const FEEDBACK_PATH = '/api/feedback';
export const THANKS_PATH = '/thanks/';

export type ParsedFeedback =
  | { ok: true; message: string; email: string | null }
  | { ok: false; error: string };

function textField(form: FormData, name: string): string | null {
  const value = form.get(name);
  if (value === null) return '';
  return typeof value === 'string' ? value.replace(/\r\n/g, '\n').trim() : null;
}

export function parseFeedback(form: FormData): ParsedFeedback {
  const message = textField(form, 'message');
  const email = textField(form, 'email');
  if (!message) return { ok: false, error: 'Message is required' };
  if (message.length > MESSAGE_MAX) return { ok: false, error: 'Message is too long' };
  if (email === null) return { ok: false, error: 'Email is invalid' };
  if (email.length > EMAIL_MAX) return { ok: false, error: 'Email is too long' };
  if (email && !email.includes('@')) return { ok: false, error: 'Email is invalid' };
  return { ok: true, message, email: email || null };
}
