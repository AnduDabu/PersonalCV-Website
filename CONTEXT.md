# Site context and gotchas

Working notes for anyone (human or agent) changing this site. Everything here was learned
the hard way; most of it is not visible from the code.

Last updated: 2026-09-17

---

## 1. What this is

React 18 + Vite 5 + Tailwind SPA, deployed to **Cloudflare Pages**. Push to `main` triggers
an automatic deploy — there is no GitHub Actions workflow; the connection is configured on
Cloudflare's side. **Every push to `main` goes straight to production.**

```
npm run dev      # Vite dev server on :5173 (no Pages Function: the contact form 404s here)
npm run build    # vite build + scripts/inject-meta.mjs (per-route HTML) into dist/
npm run lint     # ESLint, must exit 0
npx wrangler pages dev dist --binding TURNSTILE_SECRET=... # full local emulation, see §9
```

Routes (all client-side, via `react-router-dom` in `src/App.jsx`):

```
/                            Home
/project/basketball
/project/formation-control
/project/path-planning
/playground
*                            NotFound page (client-side; the server still answers 200 with the shell)
```

`main` is the only production branch. **Every other branch gets a preview deployment** at
`https://<branch>.personalcv-website.pages.dev`; test there first.

---

## 2. Verifying anything on the live site — read this first

**Always cache-bust. Cloudflare's edge will happily serve you a stale answer and make a
broken deploy look healthy.**

```powershell
$u = "https://www.alexandrudabu.com/playground?cb=" + [guid]::NewGuid().ToString("N")
curl.exe -sS -o NUL -w "%{http_code}`n" $u
```

This is not a theoretical concern. While verifying a change on 2026-07-28, an uncached
check reported `/playground → 200` and `/project/basketball → 404`, which made no sense.
Re-running with cache-busting showed **all five routes were returning 404** — the 200s were
old cached responses. Without the second check the site would have been left broken.

Also note: PowerShell string concatenation inside a `curl.exe` argument silently produces
separate arguments. Build the URL into a variable first, as above, or curl reports
`URL rejected: Bad hostname` and you misread the results.

---

## 3. DNS: apex vs www

| Host | Record | Notes |
|---|---|---|
| `www.alexandrudabu.com` | CNAME → `personalcv-website.pages.dev`, **Proxied** | Canonical host. |
| `alexandrudabu.com` | CNAME → `personalcv-website.pages.dev`, **Proxied** | Added 2026-07-28. |

The apex previously had **only MX and TXT records**, so `alexandrudabu.com` did not resolve
at all — the CV printed a link that went nowhere, and `og:image` pointed at a dead host so
LinkedIn previews rendered without an image.

Two things that look like problems but are not:

- **A CNAME at the apex is legal here.** Standard DNS forbids it alongside other records,
  but Cloudflare does CNAME flattening and publishes A/AAAA. Email keeps working.
- **Negative DNS caching.** After adding the record the apex still failed to resolve
  locally for ~30 minutes, because the previous NXDOMAIN was cached by the network
  resolver. `Clear-DnsClientCache` does not help — the cache is upstream. Query
  `1.1.1.1` directly to see the truth:
  `Resolve-DnsName alexandrudabu.com -Type A -Server 1.1.1.1`

**Canonical host is `www`.** Both hostnames serve the same content, so `src/components/SEO.jsx`
emits a canonical URL on `www` for every route. The sitemap lists `www` only. Do not add
apex URLs to the sitemap — that re-creates the duplicate-content problem the canonical exists
to solve.

A 301 redirect from apex to www is stronger than a JS-injected canonical, since it does
not depend on the crawler executing JavaScript. It is a dashboard-only change (Rules >
Redirect Rules, template "Redirect from Root to WWW"); see §10 for the pending checklist.

---

## 4. The unresolved one: missing assets return HTML, not 404

**Status: known, unfixed, do not retry naively.**

Cloudflare Pages' SPA fallback also swallows asset requests. Any missing
`/assets/*.js` returns **HTTP 200 with `Content-Type: text/html`** — the app shell.

```
/assets/index-DOESNOTEXIST.js  ->  200  text/html
```

A browser holding an `index.html` from an earlier deploy requests a bundle hash that no
longer exists, gets HTML, and refuses to execute it:

> Failed to load module script: Expected a JavaScript-or-Wasm module script but the server
> responded with a MIME type of "text/html".

The page then renders blank. This reproduces on **every** deploy for anyone with the tab
open at the time. A hard refresh (`Ctrl+Shift+R`) fixes it for that visitor.

### What was tried and reverted

Commit `7719be2` added `public/_redirects`:

```
/assets/*  /404.html  404
/*         /index.html  200
```

plus a `public/404.html`. **This broke every client-side route** — all deep links started
returning 404. Reverted in `df2d24c`.

The cause: **adding `404.html` switches Pages to custom not-found handling, which takes
precedence over the automatic SPA fallback.** The `/* /index.html 200` rule did not
restore it.

### Current mitigation (2026-09-17)

`_redirects` cannot return a 404 at all: Cloudflare's docs list non-redirect status codes
as unsupported, which is why the earlier attempt needed `404.html`. The blank page is now
handled on the client instead: `src/main.jsx` listens for Vite's `vite:preloadError`
(fired when a lazy page chunk from an older deploy fails to load) and reloads once, with a
`sessionStorage` guard against loops. The server still answers 200 + HTML for a missing
asset; that is cosmetic now. If real 404s are ever wanted, the working mechanism is a Pages
Function at `functions/assets/[[path]].js` that calls `env.ASSETS.fetch()` and converts a
`text/html` answer into a 404 — test it on a preview branch first.

---

## 5. ESLint

`npm run lint` was broken from the start — no config existed, so ESLint walked into
`dist/assets` looking for one. Added `.eslintrc.cjs` on 2026-07-28. It is `.cjs` because
`package.json` sets `"type": "module"` and ESLint 8 cannot load an ESM config.

Four rules are tuned to how the code is actually written, deliberately:

| Setting | Why |
|---|---|
| `varsIgnorePattern: '^React$'` | The codebase **mixes styles** — some files `import React`, others rely on the automatic JSX transform. Both compile. Without this, one style or the other is flagged everywhere. |
| `ignoreRestSiblings: true` | `const { onMouseEnter, ...rest } = props` names props only to exclude them from the rest object. |
| `argsIgnorePattern` / `destructuredArrayIgnorePattern: '^_'` | `_` placeholders. |
| `react/prop-types`, `react/no-unescaped-entities` off | No PropTypes in this project; escaping apostrophes in prose hurts readability for no gain. |

Note `--max-warnings 0` in the lint script: **warnings fail the build too**.

---

## 6. SEO

- `src/routesMeta.js` — **the only place** titles and descriptions are defined.
- `scripts/inject-meta.mjs` (runs inside `npm run build`) — writes one static HTML file per
  route (`dist/project/basketball.html` is served at `/project/basketball`) with that
  route's title, description, canonical and Open Graph / Twitter tags. This is what
  LinkedIn, WhatsApp, Slack, iMessage and X see: none of them run JavaScript. Verify with
  `curl -A Twitterbot/1.0 <url> | grep og:`.
- `src/components/SEO.jsx` — the same tags at runtime for client-side navigation. Uses
  `useLocation()`, so it must stay inside the Router (it is: `main.jsx` wires
  `HelmetProvider → BrowserRouter → App`). Pages call it as `<SEO />` with no props.
- `index.html` — `theme-color`, **Person JSON-LD**, and the inline theme script.
- `public/og-image.png` — 1200×630, generated from a plain HTML template (name + role
  only, so it survives the square crops WhatsApp and iMessage apply).
- `public/robots.txt`, `public/sitemap.xml` — both added 2026-07-28.

---

## 7. Content sources

The Timeline, About, Hero and Skills content mirrors the CV. The CV lives in a **separate
private repo** (`AnduDabu/CV`) with its own `CONTEXT.md` covering role details, wording
rules and things Alexandru has explicitly rejected. **Read that before rewriting any
career copy here**, or you will re-introduce phrasing he has already turned down.

`public/AlexandruDabu-CV.pdf` is a copy of `main.pdf` from that repo. When the CV changes,
rebuild it there and copy the PDF across — there is no automation.

---

## 8. Known issues not yet addressed

- **The force slider in the flocking simulation does nothing.**
  `FlockingSimulation.update()` accepts a force factor and never applies it — the parameter
  is named `_forceFactor` to mark this. Applying it would change the simulation's behaviour,
  so it was left as a separate decision.
- **`SkillsRadar` values are hand-set self-assessments** (`Software Dev 70`, `DevOps 40`, …)
  and are out of date given the Cloudflare/serverless work. They are Alexandru's own
  ratings — ask before changing them.
- **The R2 videos now use `media.alexandrudabu.com`** (custom domain on bucket `cv-media`,
  switched in code on 2026-09-17; the `r2.dev` URL is rate-limited and for development
  only). The bucket still holds the original large files (330 MB); the re-encoded copies
  (20 MB, same names, audio kept) live in the gitignored `r2-upload/` folder and must be
  uploaded with `wrangler r2 object put cv-media/<name> --file r2-upload/<name>
  --content-type video/mp4 --remote`, then purge the zone cache. See §10.
- `public/Basketball Media/Video Simulari/VideoDemo.mp4` (162 MB) is gitignored, unused,
  and above Pages' 25 MiB per-file limit. It only bloats local `dist/`; safe to delete.

---

## 9. Contact form: Pages Function + Turnstile (added 2026-09-17)

The browser no longer talks to EmailJS. `src/components/Contact.jsx` renders a Cloudflare
Turnstile widget and POSTs JSON to `/api/contact`, served by `functions/api/contact.js`:
origin check → honeypot → validation → Turnstile `siteverify` → EmailJS REST API with the
**private** key. `public/_routes.json` limits Function invocations to `/api/*` so every
other request stays a free static one.

Configuration lives outside the repo. Without it the form returns `503 not_configured`:

| Where | What |
|---|---|
| Pages > Settings > Variables and Secrets (**Production and Preview**) | Secrets `TURNSTILE_SECRET`, `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`, `EMAILJS_PRIVATE_KEY`; build variable `VITE_TURNSTILE_SITE_KEY` |
| Turnstile dashboard | One widget, hostnames `www.alexandrudabu.com`, `alexandrudabu.com`, `personalcv-website.pages.dev` |
| EmailJS > Account > Security | "Allow EmailJS API for non-browser applications" **on** |
| EmailJS template | Unchanged: parameters are still `name`, `email`, `message` |

Without `VITE_TURNSTILE_SITE_KEY` the client uses Cloudflare's always-passing test key,
which the Function rejects unless `TURNSTILE_SECRET` is the matching test secret
(`1x0000000000000000000000000000000AA`). That pairing is how `wrangler pages dev` is tested
locally; never set the test secret in production.

`public/_headers` does **not** apply to Function responses; the Function sets its own.

---

## 10. Security headers and things still pending in the dashboard

`public/_headers` ships a **Report-Only** CSP (verified with zero violations in headless
Chrome on every route). After a week with no unexpected console reports on the live site,
rename the header to `Content-Security-Policy`. The `sha256-…` source is the inline theme
script in `index.html`; run `node scripts/csp-hash.mjs` after editing that script.
`style-src` needs `'unsafe-inline'` because react-type-animation injects a `<style>`.

Expected report while Bot Fight Mode is on: Cloudflare's own inline JavaScript Detection
snippet, which cannot be hashed (it changes per response). Options: turn Bot Fight Mode off
(recommended; a static site gains nothing from it), or accept the console noise.

Done via the Cloudflare API on 2026-09-17 (verified with curl):

- Redirect Rule apex → www, 301, query string preserved (ruleset `b84cdb77…`).
- Zone HSTS: max-age 15552000 (6 months), no subdomains, no preload.
- WAF rate-limiting rule on `/api/contact`: > 3 requests per 10 s per IP → block 10 s.
- R2: re-encoded videos uploaded to `cv-media` (same names), zone cache purged; the code
  now uses `media.alexandrudabu.com`.
- Turnstile widget `0x4AAAAAAE6DPXAfdCHNkVq3` (managed, hostnames www/apex/pages.dev).
- Pages variables (Production and Preview): `VITE_TURNSTILE_SITE_KEY`, `EMAILJS_SERVICE_ID`,
  `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`.

Still pending in the dashboard (API writes were refused by the agent's permission layer):

- Security > Bots: turn off Bot Fight Mode and set "Block AI bots" to off.
- Pages > Settings > Variables and Secrets: secrets `TURNSTILE_SECRET` (from Turnstile >
  the widget > Secret key) and `EMAILJS_PRIVATE_KEY`, both for Production and Preview.
  Then retry the latest `audit-fixes` deployment so the build picks up the site key.
