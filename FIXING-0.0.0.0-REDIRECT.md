# Fixing 0.0.0.0 Redirect Issue

## Problem

When running the server with `0.0.0.0` binding and accessing via `http://192.168.1.155:3000`, the application redirects to `http://0.0.0.0:3000` after login/logout.

## Root Cause

When you start Next.js with:
```bash
next dev -H 0.0.0.0
```

The server binds to all network interfaces (`0.0.0.0`), but NextAuth sees the host as `0.0.0.0` in the request headers, causing redirects to use that address instead of the actual IP you're accessing from.

## Solution

### Option 1: Set NEXTAUTH_URL (Recommended for Development)

Set the `NEXTAUTH_URL` in your `.env` file to the actual IP/domain you're accessing:

```env
NEXTAUTH_URL="http://192.168.1.155:3000"
```

**Pros:**
- Simple and reliable
- Works immediately
- No code changes needed

**Cons:**
- Need to change when switching between localhost and LAN access
- Need different values for different environments

### Option 2: Use Hostname Instead of 0.0.0.0

Start the server with a specific hostname:

```bash
# For localhost only
npm run dev

# For LAN access with specific IP
next dev -H 192.168.1.155
```

**Pros:**
- No environment variable needed
- Server knows its actual address

**Cons:**
- Less flexible
- Need to know the IP address beforehand

### Option 3: Smart Redirect Callback (Implemented)

The application now has a smart redirect callback in `auth.config.ts` that:
1. Detects when hostname is `0.0.0.0`
2. Uses `NEXTAUTH_URL` if set
3. Falls back to referer header to get actual host
4. Replaces `0.0.0.0` with the correct hostname

**Pros:**
- Works automatically in most cases
- Handles multiple scenarios
- Fallback mechanisms

**Cons:**
- More complex
- Still needs NEXTAUTH_URL for best results

## Current Configuration

Your `.env` file now has:

```env
NEXTAUTH_URL="http://192.168.1.155:3000"
```

This ensures that even when the server sees `0.0.0.0`, it will redirect to `192.168.1.155:3000`.

## How to Use

### For Local Development (Same Machine)

1. **Update `.env`:**
   ```env
   NEXTAUTH_URL="http://localhost:3000"
   ```

2. **Start server:**
   ```bash
   npm run dev
   ```

3. **Access:**
   ```
   http://localhost:3000
   ```

### For LAN Access (Other Devices)

1. **Update `.env`:**
   ```env
   NEXTAUTH_URL="http://192.168.1.155:3000"
   ```

2. **Start server with 0.0.0.0 binding:**
   ```bash
   next dev -H 0.0.0.0
   ```

3. **Access from any device on LAN:**
   ```
   http://192.168.1.155:3000
   ```

### For Production/IIS

1. **Update `.env` on server:**
   ```env
   NEXTAUTH_URL="http://yourdomain.com"
   # or
   NEXTAUTH_URL="http://your-server-ip"
   ```

2. **Deploy and configure IIS**

3. **Access:**
   ```
   http://yourdomain.com
   ```

## Testing the Fix

1. **Set NEXTAUTH_URL in `.env`:**
   ```env
   NEXTAUTH_URL="http://192.168.1.155:3000"
   ```

2. **Restart the server:**
   ```bash
   # Stop current server (Ctrl+C)
   # Start again
   npm run dev
   # or with 0.0.0.0 binding
   next dev -H 0.0.0.0
   ```

3. **Clear browser cache and cookies**

4. **Test the flow:**
   - Access: `http://192.168.1.155:3000/admin`
   - Should redirect to: `http://192.168.1.155:3000/admin/login`
   - Login
   - Should redirect to: `http://192.168.1.155:3000/admin/dashboard`
   - Logout
   - Should redirect to: `http://192.168.1.155:3000/admin/login`

All URLs should maintain `192.168.1.155:3000`, NOT `0.0.0.0:3000`.

## Troubleshooting

### Still seeing 0.0.0.0 in URLs?

1. **Check `.env` file:**
   ```bash
   type .env
   ```
   Verify `NEXTAUTH_URL` is set correctly

2. **Restart the server:**
   Environment variables are loaded at startup

3. **Clear browser data:**
   - Clear cookies for the site
   - Clear cache
   - Try incognito/private mode

4. **Check console logs:**
   Look for any NextAuth errors in terminal

### Different URL for different scenarios?

Create multiple `.env` files:

**`.env.local`** (for localhost):
```env
NEXTAUTH_URL="http://localhost:3000"
```

**`.env.lan`** (for LAN):
```env
NEXTAUTH_URL="http://192.168.1.155:3000"
```

**`.env.production`** (for production):
```env
NEXTAUTH_URL="https://yourdomain.com"
```

Then copy the appropriate one:
```bash
copy .env.local .env
# or
copy .env.lan .env
```

## Package.json Scripts

You can add convenience scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:lan": "next dev -H 0.0.0.0",
    "dev:local": "next dev -H localhost",
    "build": "next build",
    "start": "next start"
  }
}
```

Then use:
```bash
npm run dev:lan    # For LAN access
npm run dev:local  # For localhost only
```

## For IIS Deployment

When deploying to IIS, the `0.0.0.0` issue doesn't occur because IIS handles the host headers properly. However, you should still set `NEXTAUTH_URL` to your production domain:

```env
NEXTAUTH_URL="http://your-iis-domain.com"
AUTH_SECRET="your-production-secret"
DATABASE_URL="your-production-database"
NODE_ENV=production
```

## Summary

**The Fix:**
1. Set `NEXTAUTH_URL` in `.env` to the actual URL you're accessing
2. The smart redirect callback in `auth.config.ts` handles edge cases
3. Restart server after changing `.env`
4. Clear browser cache/cookies

**Best Practice:**
- Use `NEXTAUTH_URL` for development and production
- Set it to the actual URL users will access
- Different values for different environments
- Always restart server after changing `.env`

This ensures consistent URL handling across all authentication flows.
