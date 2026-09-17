// Contact form backend. Runs as a Cloudflare Pages Function at POST /api/contact.
//
// Why this exists: the form used to post straight from the browser to EmailJS with the
// service/template/public key in the bundle, so anyone could burn the monthly quota or
// flood the inbox from a script. Now the browser only ever talks to this endpoint, which
//   1. checks the request comes from this site,
//   2. verifies a Cloudflare Turnstile token (server-side, single use),
//   3. forwards to EmailJS with the *private* key, which never reaches the client.
//
// Secrets (Pages > Settings > Variables and Secrets, set for Production AND Preview):
//   TURNSTILE_SECRET, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY,
//   EMAILJS_PRIVATE_KEY
// EmailJS side: Account > Security > "Allow EmailJS API for non-browser applications" must be on.
//
// Note: `public/_headers` does not apply to Function responses, so headers are set here.

const ALLOWED_ORIGINS = new Set([
    'https://www.alexandrudabu.com',
    'https://alexandrudabu.com',
]);
const MAX_NAME = 200;
const MAX_MESSAGE = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body, status = 200) =>
    new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff',
        },
    });

const isAllowedOrigin = (origin, url) => {
    if (ALLOWED_ORIGINS.has(origin)) return true;
    // Preview deployments (*.pages.dev) and `wrangler pages dev` (localhost): accept the
    // request's own origin so the form can be tested before merging.
    const local = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    return (url.hostname.endsWith('.pages.dev') || local) && origin === url.origin;
};

export async function onRequestPost({ request, env }) {
    const origin = request.headers.get('Origin') || '';
    if (!isAllowedOrigin(origin, new URL(request.url))) return json({ error: 'forbidden' }, 403);

    let body;
    try {
        body = await request.json();
    } catch {
        return json({ error: 'bad_request' }, 400);
    }

    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim();
    const message = String(body.message ?? '').trim();
    const token = String(body.token ?? '');

    // Honeypot: real users never see or fill this field. Answer "ok" so the bot moves on.
    if (body.website) return json({ ok: true });

    if (!name || name.length > MAX_NAME) return json({ error: 'invalid_name' }, 400);
    if (!EMAIL_RE.test(email) || email.length > 320) return json({ error: 'invalid_email' }, 400);
    if (message.length < 5 || message.length > MAX_MESSAGE) return json({ error: 'invalid_message' }, 400);
    if (!token) return json({ error: 'captcha_missing' }, 400);

    if (!env.TURNSTILE_SECRET || !env.EMAILJS_PRIVATE_KEY) {
        // Secrets not configured for this environment (typically a fresh preview).
        return json({ error: 'not_configured' }, 503);
    }

    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            secret: env.TURNSTILE_SECRET,
            response: token,
            remoteip: request.headers.get('CF-Connecting-IP') ?? undefined,
        }),
    }).then((r) => r.json()).catch(() => ({ success: false }));
    if (!verify.success) return json({ error: 'captcha_failed' }, 403);

    const send = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            service_id: env.EMAILJS_SERVICE_ID,
            template_id: env.EMAILJS_TEMPLATE_ID,
            user_id: env.EMAILJS_PUBLIC_KEY,
            accessToken: env.EMAILJS_PRIVATE_KEY,
            // Same parameter names the old sendForm() submitted, so the template is unchanged.
            template_params: { name, email, message },
        }),
    });
    if (!send.ok) return json({ error: 'send_failed' }, 502);
    return json({ ok: true });
}

// Anything but POST on this path.
export function onRequest({ request }) {
    if (request.method === 'POST') return undefined;
    return json({ error: 'method_not_allowed' }, 405);
}
