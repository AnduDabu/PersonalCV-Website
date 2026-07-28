# Site context and gotchas

Working notes for anyone (human or agent) changing this site. Everything here was learned
the hard way; most of it is not visible from the code.

Last updated: 2026-07-28

---

## 1. What this is

React 18 + Vite 5 + Tailwind SPA, deployed to **Cloudflare Pages**. Push to `main` triggers
an automatic deploy — there is no GitHub Actions workflow; the connection is configured on
Cloudflare's side. **Every push to `main` goes straight to production.**

```
npm run dev      # Vite dev server on :5173
npm run build    # production build into dist/
npm run lint     # ESLint, must exit 0
```

Routes (all client-side, via `react-router-dom` in `src/App.jsx`):

```
/                            Home
/project/basketball
/project/formation-control
/project/path-planning
/playground
```

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

A 301 redirect from apex to www would be stronger than a JS-injected canonical, since it does
not depend on the crawler executing JavaScript. It was considered and not done.

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

### If you try again

- The likely fix is `_redirects` **without** any `404.html`, so the SPA fallback stays active.
- **Test on a Cloudflare preview deployment first** (push a branch — Pages builds it at its
  own URL, production untouched). Do not test this in production again.
- After deploying, verify **all five routes with cache-busting** before declaring success.
- Weigh it honestly: the downside of getting this wrong is every page 404s; the downside of
  leaving it is an occasional blank page cured by a refresh.

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

- `src/components/SEO.jsx` — per-route `<title>`, description, **canonical**, og and twitter
  tags. Uses `useLocation()`, so it must stay inside the Router (it is: `main.jsx` wires
  `HelmetProvider → BrowserRouter → App`).
- `index.html` — static `<title>`, meta description, `theme-color`, and **Person JSON-LD**.
  These are the static fallback: `react-helmet-async` only applies after React mounts, so
  crawlers and link unfurlers that skip JavaScript see only what is in the served HTML.
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
- **The bundle is ~712 KB**, over Vite's 500 KB warning. No code splitting is configured.
