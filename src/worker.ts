import { parseFeedback } from '@/lib/feedback';

const FEEDBACK_PATH = '/api/feedback';
const THANKS_PATH = '/thanks/';

async function handleFeedback(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
  }
  const form = await request.formData();
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
