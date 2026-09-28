// Post-build: write one static HTML file per route with that route's title, description,
// canonical and Open Graph / Twitter tags. Cloudflare Pages serves `dist/project/x.html`
// at `/project/x` (clean URLs), so crawlers that do not run JavaScript get correct tags.
// Runtime tags from SEO.jsx stay in place and are identical, sourced from src/routesMeta.js.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { ROUTES, SITE_URL, SITE_NAME, OG_IMAGE } from '../src/routesMeta.js';

const DIST = 'dist';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const base = readFileSync(join(DIST, 'index.html'), 'utf8');

for (const [path, m] of Object.entries(ROUTES)) {
    const url = `${SITE_URL}${path}`;
    const image = `${SITE_URL}${OG_IMAGE.path}`;
    const tags = [
        `<link rel="canonical" href="${url}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
        `<meta property="og:locale" content="en_US" />`,
        `<meta property="og:url" content="${url}" />`,
        `<meta property="og:title" content="${esc(m.title)}" />`,
        `<meta property="og:description" content="${esc(m.description)}" />`,
        `<meta property="og:image" content="${image}" />`,
        `<meta property="og:image:width" content="${OG_IMAGE.width}" />`,
        `<meta property="og:image:height" content="${OG_IMAGE.height}" />`,
        `<meta property="og:image:alt" content="${esc(OG_IMAGE.alt)}" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${esc(m.title)}" />`,
        `<meta name="twitter:description" content="${esc(m.description)}" />`,
        `<meta name="twitter:image" content="${image}" />`,
    ].map((t) => `  ${t}`).join('\n');

    const html = base
        .replace(/<title>[^<]*<\/title>/, `<title>${esc(m.title)}</title>`)
        .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(m.description)}" />`)
        .replace('</head>', `${tags}\n</head>`);

    const file = path === '/' ? join(DIST, 'index.html') : join(DIST, `${path}.html`);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
    console.log(`meta: ${path} -> ${file}`);
}
