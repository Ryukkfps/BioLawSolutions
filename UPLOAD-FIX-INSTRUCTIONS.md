# Upload Fix Instructions

## Problem
Images uploaded through the CMS were not appearing until pm2 was restarted. This was caused by Next.js standalone mode not serving files from the `public/uploads` directory in real-time.

## Solution
Images are now saved outside the `public` folder and served via an API route (`/api/uploads/[...path]`), which works correctly with pm2 and standalone mode.

## Migration Steps

### 1. Run the migration script
This will copy existing images and update database paths:

```bash
npx tsx scripts/migrate-uploads.ts
```

### 2. Restart your application
```bash
pm2 restart all
```

### 3. Verify the fix
- Upload a new image through the CMS
- Check that it appears immediately without restarting pm2
- Verify existing images still load correctly

## What Changed

### Files Modified:
- `app/api/upload/route.ts` - Now saves to `/uploads` instead of `/public/uploads`
- `prisma/seed.ts` - Updated image paths to use `/api/uploads/`

### Files Created:
- `app/api/uploads/[...path]/route.ts` - New API route to serve uploaded images
- `scripts/migrate-uploads.ts` - Migration script for existing data

## Technical Details

### Before:
- Images saved to: `public/uploads/`
- Served from: `/uploads/filename.jpg` (static file)
- Issue: Standalone mode doesn't serve new files from `public` without restart

### After:
- Images saved to: `uploads/` (root level, outside public)
- Served from: `/api/uploads/filename.jpg` (API route)
- Benefit: API routes work immediately in standalone mode with pm2

## Rollback (if needed)

If you need to rollback:

1. Revert changes to `app/api/upload/route.ts`
2. Delete `app/api/uploads/[...path]/route.ts`
3. Copy images back to `public/uploads/`
4. Update database paths back to `/uploads/`

## Notes

- The migration script is safe to run multiple times
- Old images in `public/uploads/` can be deleted after successful migration
- The new `uploads/` folder should be added to `.gitignore` if not already present
