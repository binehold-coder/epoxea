# OAuth & Decap CMS Login Bug — Debug Report

## Problem Summary
Decap CMS (3.9.0) on GitHub backend with Cloudflare Workers OAuth is **NOT persisting login session**. User logs in via GitHub, OAuth window shows token successfully, page reloads, but then **login screen appears again** instead of showing CMS collections.

## Current Setup
- **Worker deployed**: `https://epoxea.binehold.workers.dev` (Cloudflare Workers via wrangler)
- **Worker code**: `workers/decap-oauth/src/index.js`
- **Admin page**: `admin/index.html`
- **CMS config**: `admin/config.yml`
- **Decap CMS version**: 3.9.0
- **CMS init mode**: Manual (via `window.CMS_MANUAL_INIT = true`) to prevent double-mount errors
- **GitHub OAuth App**: Callback URL properly set to `https://epoxea.binehold.workers.dev/callback`

## Workflow (What Should Happen)
1. User opens `/admin/` → Decap CMS loads, no token yet → shows "Login with GitHub" button
2. User clicks → opens popup to GitHub OAuth `/auth` endpoint
3. Popup redirects to GitHub → user authorizes → GitHub redirects back to `/callback`
4. Worker at `/callback` exchanges code for token, returns HTML with postMessage
5. postMessage sends token to opener (`admin/index.html`)
6. **admin/index.html receives token via window.addEventListener('message')**, stores in localStorage as `netlify-cms-user`
7. Page reloads
8. On reload, Decap should read `netlify-cms-user` from localStorage and show collections WITHOUT asking for login again

## What Actually Happens
- Steps 1–4 work ✓
- Token arrives and is displayed in popup window ✓
- Popup closes ✓
- **admin/index.html page reloads, but postMessage event listener may NOT be receiving the token OR localStorage payload is wrong**
- After reload, Decap CMS still shows login screen

## Attempted Fixes (In Order)

### Attempt 1: Fix OAuth base_url domain mismatch
**Issue**: `admin/config.yml` had `base_url: https://epoxea-cms.binehold.workers.dev` but worker is deployed to `https://epoxea.binehold.workers.dev`
**Fix**: Changed `base_url` to `https://epoxea.binehold.workers.dev` in `admin/config.yml`
**Result**: GitHub OAuth dialog no longer shows "redirect_uri is not associated" error ✓, but login persistence still broken

### Attempt 2: Move GitHub OAuth secrets to Wrangler secrets
**Issue**: `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` were hardcoded in `workers/decap-oauth/wrangler.toml`
**Fix**: 
- Removed `[vars]` section from `wrangler.toml`
- Used `wrangler secret put GITHUB_CLIENT_ID` and `wrangler secret put GITHUB_CLIENT_SECRET`
- Redeployed worker
**Result**: Secrets now secure ✓, but auth persistence still broken

### Attempt 3: localStorage payload with `backend: "github"`
**Issue**: Decap might not recognize `backend` field
**Fix**: Changed `admin/index.html` to store `{ token, backend: "github" }` in localStorage
**Result**: No improvement, still shows login screen

### Attempt 4: localStorage payload with `provider: "github"`
**Issue**: `backend` might be wrong field name; Decap uses `provider`
**Fix**: Changed to `{ token, provider: "github" }`
**Result**: No improvement

### Attempt 5: Enhanced payload with `provider + login + user profile`
**Issue**: Decap might need additional fields for session validation
**Fix**: Modified to fetch GitHub user profile via `https://api.github.com/user` and store:
```json
{
  "token": "gho_xxx",
  "provider": "github",
  "login": "username",
  "user": {
    "login": "username",
    "name": "Full Name",
    "avatar_url": "...",
    "html_url": "https://github.com/username"
  }
}
```
**Result**: No improvement

### Attempt 6: Add `backendName: "github"` field + sessionStorage mirror
**Issue**: Maybe Decap needs `backendName` in addition to `provider`
**Fix**: Added `backendName: "github"` to payload, also stored in `sessionStorage` as fallback
**Result**: Still broken

### Attempt 7: Add verbose logging to trace flow
**Issue**: Cannot see if postMessage reaches admin page or what happens on page reload
**Fix**: Added console.log statements:
- `[Decap OAuth] postMessage received` when message arrives
- `[Decap OAuth] stored netlify-cms-user` when saving to localStorage
- `[Decap OAuth] existing netlify-cms-user` when page reloads
- `[Decap OAuth] no stored user yet` if nothing in storage
**Result**: User reports these logs do NOT appear in console → suggests postMessage is NOT reaching the admin page

## Root Cause Hypothesis
Since postMessage logs never appear in console, the issue is likely:

1. **Window reference broken**: The popup's `window.opener` might be null or closed before postMessage is sent
2. **Timing issue**: postMessage sent before `admin/index.html` event listener is attached
3. **Cross-origin/CORS issue**: postMessage blocked by browser policy (unlikely with same-origin setup)
4. **Worker HTML response issue**: Worker's `/callback` HTML may not properly reference the parent window
5. **Page navigation issue**: Browser might navigate away from `/admin/` before postMessage is processed

## Key Code Locations
- Worker OAuth callback response: `workers/decap-oauth/src/index.js` (lines ~45–70) — generates HTML with postMessage script
- Admin page OAuth listener: `admin/index.html` (lines ~18–40+) — should receive postMessage
- Decap init: `admin/index.html` (lines ~50–70+) — tries to init CMS after manual flag

## Next Steps to Debug
1. **Check if postMessage is actually being sent**: Add log in worker's `/callback` HTML template before `window.opener.postMessage()`
2. **Verify event listener is attached**: Check if DOMContentLoaded fires before postMessage is sent
3. **Check window.opener is not null**: Log `window.opener` in worker's HTML
4. **Alternative approach**: Instead of relying on postMessage for popup window, use:
   - URL hash/query params to pass token (less secure but simpler)
   - localStorage with polling mechanism
   - Service worker to intercept OAuth redirect
5. **Test with simpler payload**: Try storing just `{ token }` without extra fields and see if Decap recognizes it
6. **Check Decap CMS source**: Look at what Decap actually expects in localStorage for GitHub auth

## Files Modified
- `admin/config.yml` — Fixed `base_url` domain
- `workers/decap-oauth/wrangler.toml` — Removed hardcoded secrets
- `admin/index.html` — Added OAuth token handler, various payload attempts, logging

## Commits Made
- "CMS: fix OAuth base_url to deployed worker domain"
- "Security: move GitHub OAuth to Wrangler secrets"
- "CMS: store GitHub token with provider for persisted login"
- "CMS: persist GitHub session with user profile in netlify-cms-user"
- "CMS: add debug logs for OAuth postMessage token handling"
- "CMS: broaden stored GitHub auth payload and log existing session"

## Open Questions
- Does `window.opener.postMessage()` in worker's callback HTML successfully send the message?
- Is the event listener in `admin/index.html` being set up before postMessage fires?
- What exact shape does Decap CMS expect in `localStorage.getItem('netlify-cms-user')`?
- Should we use a different storage mechanism or OAuth flow entirely?
