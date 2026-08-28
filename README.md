# Professional Site

A single-page portfolio site. Dark base, light-purple neon accents, no build step and no
dependencies — plain HTML, CSS, and a small progressive-enhancement JavaScript file.

## Run it

Double-click `index.html`. That's it.

For a local server (needed only if you later add `fetch`-based features):

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Files

| Path                  | What's in it                                                        |
| --------------------- | ------------------------------------------------------------------- |
| `index.html`          | All content and page structure. **This is the file you edit.**      |
| `assets/css/style.css`| All styling. Theme colors live in the `:root` block at the top.     |
| `assets/js/main.js`   | Nav, scroll reveal, typewriter, stat counters, project filter, copy-email. Optional — the page works without it. |

Content lives directly in the HTML rather than in a JS data file, so the page renders with
JavaScript disabled and search engines and LinkedIn previews can read it.

## Filling in your content

Every placeholder is marked with a `TODO` comment in `index.html`. Search the file for `TODO`
and work top to bottom. In order:

1. **`<head>`** — page title, meta description, author, Open Graph tags.
2. **Nav brand** — your name or handle.
3. **Hero** — availability chip, full name, job title, the three typewriter phrases
   (`data-typewriter`, valid JSON array), your 2–3 sentence pitch, and the résumé filename.
4. **Stats** — the `data-count-to` numbers. Only keep numbers you can defend in an interview;
   delete the rest of the `<div class="stat">` blocks.
5. **`profile.yaml` panel** — the terminal card in the hero. Plain text, edit freely.
6. **About** — three paragraphs and the facts table.
7. **Skills** — six cards. Delete any group that doesn't apply.
8. **Experience** — three timeline entries, newest first. One action + one result per bullet.
9. **Projects** — four cards. `data-tags` must match the `data-filter` values on the filter
   chips above the grid (`automation`, `detection`, `ot`, `tooling`), or filtering will hide
   the card. Replace the `href="#"` links with real ones or remove them.
10. **Certifications** — only what you currently hold; mark anything unfinished as in progress.
    See [Credential badges](#credential-badges) below for adding badge images.
11. **Contact** — email in **both** the `mailto:` href and the `data-email` attribute on the
    copy button, plus LinkedIn and GitHub URLs.
12. **Footer** — your name.

### Adding or removing a section

Copy an existing `<section class="section" id="...">` block, then add a matching
`<li><a href="#your-id">Label</a></li>` to the nav. The scroll-spy and reveal animations
pick it up automatically — no JS changes needed. Renumber the `section__index` values
(`01`, `02`, …) to keep them sequential.

## Credential badges

Badge cards in the certifications section pull the image straight from the issuer.
For Accredible / credential.net credentials:

```html
<a class="badge reveal" href="https://www.credential.net/YOUR-CREDENTIAL-ID" target="_blank" rel="noopener">
  <span class="badge__media">
    <img class="badge__img"
         src="https://api.accredible.com/v1/frontend/credential_website_embed_image/badge/171233958"
         alt="Elastic Certified Analyst badge"
         width="200" height="200" loading="lazy" decoding="async" data-abbr="ECA">
  </span>
  <span class="badge__body">
    <span class="badge__name">Elastic Certified Analyst</span>
    <span class="badge__meta mono">Elastic · 2026</span>
    <span class="badge__verify">Verify</span>
  </span>
</a>
```

Get the numeric badge id from the credential's **Add to your website** embed snippet.
Then set the wrapping `href` to the public credential page — a badge nobody can verify is
worth less than plain text.

Notes:

- **Keep `width="200" height="200"`.** That's the native size the endpoint serves, and the
  attributes reserve layout space so the grid doesn't jump as images load.
- **`data-abbr`** is the fallback shown if the image fails to load (offline, issuer down,
  placeholder id). `main.js` swaps in a mono text tile instead of a broken-image icon.
- **Dark-inked badges** can disappear against the near-black background. Add
  `class="badge__img badge__img--plate"` to put that badge on a light disc.
- **Credly** badges work the same way — use the image URL from the badge's share options.
- **Hotlinking vs. local copies:** hotlinking means a revoked or re-issued credential stays
  current automatically, and it's what the `credential_website_embed_image` endpoint is for.
  The tradeoff is an external dependency and a hit to the issuer on every page load. To host
  locally instead, save the PNG into `assets/img/` and point `src` at it — but remember to
  refresh it if the credential changes.
- **No badge image?** Use the text-tile form for education and in-progress items:
  `<span class="badge__media"><span class="badge__abbr mono">EDU</span></span>`. Add
  `badge--pending` to the card for anything not yet earned.

## Recoloring

Edit the tokens in `:root` at the top of `style.css`. The accent is used everywhere via
`var(--accent)`, so changing these three lines reskins the whole site:

```css
--accent:      #C4A5FF;  /* light purple */
--accent-deep: #8B5CF6;  /* gradient partner, section numbers */
--glow:        rgba(139, 92, 246, 0.40);  /* card + button glow */
```

If you change the accent to something lighter, check contrast against `--bg` (#0B0714) —
aim for at least 4.5:1 for body text and 3:1 for large text.

## Before you share the link

- [ ] No `TODO` strings left: `grep -c TODO index.html` should print `0`.
- [ ] No `href="#"` or `example.com` placeholders remaining.
- [ ] Résumé PDF in the folder is the current version, and the filename in the two download
      links matches it.
- [ ] Nothing employer-confidential in the project descriptions — describe the problem and
      your approach, not internal architecture, hostnames, or vendor specifics.
- [ ] Check it on a phone. The nav collapses to a menu button under 760px.
- [ ] Add `assets/img/og.png` (1200×630) and point the `og:image` meta tag at it, so the link
      shows a preview card when shared.

## Deploying

**GitHub Pages** (free, custom domain supported):

```bash
git init && git add . && git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
# Repo → Settings → Pages → Source: main branch, / (root)
```

Live at `https://<you>.github.io/<repo>/`. Alternatives: drag the folder onto
[Netlify Drop](https://app.netlify.com/drop), or run `npx vercel` in this directory.

Note this folder currently sits inside OneDrive. If you `git init` here, OneDrive will sync
the `.git` directory too — harmless, but moving the project outside OneDrive first avoids
occasional file-lock conflicts during commits.
