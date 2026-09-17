// Recomputes the CSP hash of the inline theme script in index.html and writes it into
// public/_headers. Run after editing that script:  node scripts/csp-hash.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const html = readFileSync('index.html', 'utf8');
const m = html.match(/<script id="theme-init">([\s\S]*?)<\/script>/);
if (!m) throw new Error('theme-init script not found in index.html');
const hash = `sha256-${createHash('sha256').update(m[1]).digest('base64')}`;

const headers = readFileSync('public/_headers', 'utf8');
const updated = headers.replace(/'sha256-[A-Za-z0-9+/=_]+'/g, `'${hash}'`);
if (updated === headers && !headers.includes(hash)) throw new Error('no sha256 source found in public/_headers');
writeFileSync('public/_headers', updated);
console.log(hash);
