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

    const viaCloudflare = Boolean(
        env.CF_EMAIL_TOKEN && env.CF_ACCOUNT_ID && env.CONTACT_FROM && env.CONTACT_TO,
    );
    if (!env.TURNSTILE_SECRET || !(viaCloudflare || env.EMAILJS_PRIVATE_KEY)) {
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

    const sent = viaCloudflare
        ? await deliverViaCloudflare(env, { name, email, message })
        : await deliverViaEmailJS(env, { name, email, message });
    if (!sent.ok) {
        // Providers answer with a short reason, e.g. "API access from non-browser environments
        // is currently disabled." Swallowing it once cost an afternoon, so log it and echo it
        // back on preview deployments, where only we can see it.
        console.error('Contact send failed:', sent.via, sent.status, sent.detail);
        const isPreview = new URL(request.url).hostname.endsWith('.pages.dev');
        return json(
            { error: 'send_failed', ...(isPreview && { status: sent.status, detail: sent.detail.slice(0, 300) }) },
            502,
        );
    }
    return json({ ok: true });
}

// Cloudflare Email Service. Used once CF_EMAIL_TOKEN, CF_ACCOUNT_ID, CONTACT_FROM and
// CONTACT_TO exist, so the notification comes from the site's own domain rather than from a
// personal Gmail account. Sending to an address already verified as an Email Routing
// destination is free on every plan.
async function deliverViaCloudflare(env, { name, email, message }) {
    const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/email/sending/send`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${env.CF_EMAIL_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: { address: env.CONTACT_FROM, name: 'alexandrudabu.com' },
                to: env.CONTACT_TO,
                // Hitting reply answers the visitor instead of yourself.
                reply_to: { address: email, name },
                subject: `Contact form: ${name}`,
                text: `From: ${name} <${email}>\n\n${message}\n`,
            }),
        },
    );
    const detail = await res.text().catch(() => '');
    // This API can answer 200 with success:false, so the flag decides rather than the status.
    let ok = res.ok;
    try {
        ok = ok && JSON.parse(detail).success !== false;
    } catch {
        ok = false;
    }
    return { via: 'cloudflare', ok, status: res.status, detail };
}

// EmailJS, the original path. Kept so the form keeps working until the Cloudflare variables
// are in place, and as a fallback if that route ever has to be rolled back.
async function deliverViaEmailJS(env, { name, email, message }) {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
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
    return {
        via: 'emailjs',
        ok: res.ok,
        status: res.status,
        detail: res.ok ? '' : await res.text().catch(() => ''),
    };
}

// Anything but POST on this path.
export function onRequest({ request }) {
    if (request.method === 'POST') return undefined;
    return json({ error: 'method_not_allowed' }, 405);
}
