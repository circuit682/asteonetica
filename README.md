# Asteonetica

Kenya-based asteroid research and observatory platform built with Next.js.

## Local Development

Run development server:

```bash
npm run dev
```

Run quality checks:

```bash
npm run lint
npm run build
```

## Deployment Checklist

Use this checklist before every production release.

1. Ensure there are no lint errors.
2. Ensure production build succeeds.
3. Confirm mission-control-protected APIs still require authentication.
4. Confirm routing and navigation behavior on desktop and mobile.
5. Deploy to production (not preview) for indexing.

## SEO and Indexing Checklist

### 1) Required Production Environment Variables

Set these in Vercel Production:

- `NEXT_PUBLIC_SITE_URL=https://asteonetica.vercel.app` (or your custom domain later)
- `GOOGLE_SITE_VERIFICATION=<your-search-console-token>`

When custom domain is live, change `NEXT_PUBLIC_SITE_URL` to:

- `https://asteonetica.org`

### 2) Confirm Crawl Surfaces

After deploy, verify these URLs in a browser:

- `/robots.txt`
- `/sitemap.xml`

These are generated from:

- `app/robots.ts`
- `app/sitemap.ts`

### 3) Google Search Console Steps

1. Add property for your production URL.
2. Verify ownership using the meta tag method.
3. Submit sitemap URL: `https://<your-domain>/sitemap.xml`.
4. Request indexing for key pages.

### 4) Initial Pages to Request Indexing

- `/`
- `/afronauts`
- `/observatory`
- `/vault`
- `/dispatch`

### 5) Visibility Signals

To improve rankings over time:

1. Publish regular high-quality updates in Dispatch and Vault.
2. Earn links from relevant astronomy and research communities.
3. Keep titles and descriptions aligned with real search intent.

## Notes

- Preview deployments may be treated differently by crawlers; treat production as the public observatory.
- Keep metadata and structured content accurate and consistent across releases.

## Release Day Checklist

Follow this sequence when shipping a production update.

1. Pull latest default branch and resolve conflicts.
2. Run final checks:

```bash
npm run lint
npm run build
```

3. Stage and commit:

```bash
git add .
git commit -m "release: <short summary>"
```

4. Push to default branch:

```bash
git push origin main
```

5. Confirm Vercel production deployment completed successfully.
6. Smoke test critical routes:

- `/`
- `/afronauts`
- `/observatory`
- `/vault`
- `/dispatch`
- `/mission-control/login`

7. Confirm SEO surfaces after deploy:

- `/robots.txt`
- `/sitemap.xml`

8. In Google Search Console:

1. Inspect updated key URLs.
2. Request indexing when needed.
3. Check sitemap status and coverage.

9. Record release notes in your preferred log channel (issues, discussions, or changelog).

## Rollback Checklist

Use this if a production release introduces a critical issue.

1. Confirm incident scope (affected routes, APIs, and user impact).
2. Pause additional merges until rollback is complete.
3. Roll back using your hosting provider to the last known good deployment.
4. Verify core routes after rollback:

- `/`
- `/afronauts`
- `/observatory`
- `/vault`
- `/dispatch`
- `/mission-control/login`

5. Verify crawl surfaces still respond correctly:

- `/robots.txt`
- `/sitemap.xml`

6. Post incident note with:

1. root cause summary
2. affected release hash/commit
3. corrective fix plan

7. Create follow-up patch in a new commit, re-run lint/build, and redeploy.

## Under Construction Fallback

You can temporarily switch selected routes to a safe fallback view without deleting page code.

1. Set environment variable:

- `NEXT_PUBLIC_UNDER_CONSTRUCTION_ROUTES=afronauts,observatory,vault,dispatch`

2. Supported route keys:

- `afronauts`
- `observatory`
- `vault`
- `dispatch`

3. Dedicated fallback route:

- `/under-construction` (marked `noindex`)

4. To return a route to live content, remove its key from `NEXT_PUBLIC_UNDER_CONSTRUCTION_ROUTES` and redeploy.

### Mission Control Toggle Mode

You can also manage these flags live from Mission Control without changing environment variables.

1. Open Mission Control and find `Site Visibility Controls`.
2. Toggle routes on or off.
3. Click `Save Visibility Controls`.

API endpoint used by the control panel:

- `GET /api/site-flags`
- `PATCH /api/site-flags` (mission-control auth required)
