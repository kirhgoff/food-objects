import { BODY_MAX, FEEDBACK_PATH, parseFeedback, THANKS_PATH } from '@/lib/feedback';

const FORM_CONTENT_TYPES = ['application/x-www-form-urlencoded', 'multipart/form-data'];

function isFormContentType(request: Request): boolean {
  const type = request.headers.get('content-type') ?? '';
  return FORM_CONTENT_TYPES.some((allowed) => type.startsWith(allowed));
}

function isWithinBodyLimit(request: Request): boolean {
  const length = Number(request.headers.get('content-length'));
  return Number.isInteger(length) && length <= BODY_MAX;
}

async function handleFeedback(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
  }
  if (!isFormContentType(request)) return new Response('Unsupported media type', { status: 415 });
  if (!isWithinBodyLimit(request)) return new Response('Payload too large', { status: 413 });
  const form = await request.formData().catch(() => null);
  if (!form) return new Response('Malformed form', { status: 400 });
  const thanks = Response.redirect(new URL(THANKS_PATH, request.url).toString(), 303);
  if (String(form.get('website') ?? '') !== '') return thanks;
  const parsed = parseFeedback(form);
  if (!parsed.ok) return new Response(parsed.error, { status: 400 });
  await env.DB.prepare('INSERT INTO feedback (message, email, user_agent) VALUES (?, ?, ?)')
    .bind(parsed.message, parsed.email, request.headers.get('user-agent'))
    .run();
  return thanks;
}

export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname === FEEDBACK_PATH) return handleFeedback(request, env);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
