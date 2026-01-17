# URL Redirect Fix - Quick Reference

## The Problem
Accessing `http://192.168.1.155:3000/admin` redirects to `http://0.0.0.0:3000`

## The Solution
Set `NEXTAUTH_URL` in `.env` to match your access URL

## Quick Fix Steps

### 1. Update `.env`
```env
NEXTAUTH_URL="http://192.168.1.155:3000"
```

### 2. Restart Server
```bash
# Press Ctrl+C to stop
npm run dev
# or for LAN access
next dev -H 0.0.0.0
```

### 3. Clear Browser
- Clear cookies for the site
- Clear cache
- Or use incognito mode

### 4. Test
- Go to: `http://192.168.1.155:3000/admin`
- Should redirect to: `http://192.168.1.155:3000/admin/login` ✅
- Login
- Should go to: `http://192.168.1.155:3000/admin/dashboard` ✅
- Logout
- Should go to: `http://192.168.1.155:3000/admin/login` ✅

## Different Scenarios

| Scenario | NEXTAUTH_URL Value |
|----------|-------------------|
| Localhost | `http://localhost:3000` |
| LAN Access | `http://192.168.1.155:3000` |
| Production | `https://yourdomain.com` |
| IIS | `http://your-server-ip` or domain |

## What Changed

### `auth.config.ts`
- Added smart redirect callback
- Detects and replaces `0.0.0.0` with `NEXTAUTH_URL`
- Uses referer header as fallback

### `.env`
- Set `NEXTAUTH_URL="http://192.168.1.155:3000"`
- This tells NextAuth the actual URL to use

## Why This Happens

When you start the server with `0.0.0.0` binding:
```bash
next dev -H 0.0.0.0
```

The server listens on all network interfaces but doesn't know which IP you're accessing from. NextAuth sees `0.0.0.0` in the host header and uses it for redirects.

Setting `NEXTAUTH_URL` explicitly tells NextAuth the correct URL to use.

## Troubleshooting

### Still seeing 0.0.0.0?
1. Check `.env` has `NEXTAUTH_URL` set
2. Restart the server (environment variables load at startup)
3. Clear ALL browser cookies and cache
4. Try incognito/private browsing mode

### Need to switch between localhost and LAN?
Create two `.env` files and swap them:

**`.env.local`:**
```env
NEXTAUTH_URL="http://localhost:3000"
```

**`.env.lan`:**
```env
NEXTAUTH_URL="http://192.168.1.155:3000"
```

Switch with:
```bash
copy .env.lan .env
```

## For IIS Deployment

Set in production `.env`:
```env
NEXTAUTH_URL="http://your-domain-or-ip"
AUTH_SECRET="your-secure-secret"
NODE_ENV=production
```

## Documentation

- Full details: `FIXING-0.0.0.0-REDIRECT.md`
- IIS deployment: `IIS-DEPLOYMENT-GUIDE.md`
- Quick start: `QUICK-START.md`

---

**Status:** ✅ Fixed
**Action Required:** Set `NEXTAUTH_URL` in `.env` and restart server
