---
description: Repository Information Overview
alwaysApply: true
---

# BioLawSolutions Information

## Summary
BioLawSolutions is a Next.js-based web application for a law firm. It features an administrative interface for managing content like services, carousel slides, and appointments. The project uses Prisma ORM with a MongoDB database and is specifically configured for deployment on Windows Server using IIS with `iisnode`.

## Structure
- **app/**: Next.js App Router containing pages and API routes (admin, about, contact, reviews, services).
- **components/**: UI components categorized into `admin` and `public` subdirectories.
- **lib/**: Shared utilities, server actions, and the generated Prisma client.
- **prisma/**: Database schema (`schema.prisma`) and data seeding scripts.
- **public/**: Static assets including images and user uploads.

## Language & Runtime
**Language**: TypeScript  
**Version**: Next.js 16.1.1, React 19.2.3, TypeScript 5  
**Build System**: Next.js Build  
**Package Manager**: pnpm (workspace supported), npm (used in build scripts)

## Dependencies
**Main Dependencies**:
- `next`: 16.1.1
- `react`: 19.2.3
- `@prisma/client`: ^5.22.0
- `next-auth`: 5.0.0-beta.30
- `lucide-react`: ^0.562.0
- `tailwind-merge`: ^3.4.0
- `clsx`: ^2.1.1

**Development Dependencies**:
- `prisma`: ^5.22.0
- `tailwindcss`: ^4
- `typescript`: ^5
- `tsx`: ^4.19.2
- `eslint`: ^9

## Build & Installation
```bash
# Install dependencies
pnpm install

# Generate Prisma client
npx prisma generate

# Build for production
pnpm run build
```

## Deployment (IIS)
The project includes specific configuration for hosting on **Internet Information Services (IIS)**:
- **server.js**: Custom entry point for `iisnode`.
- **web.config**: IIS configuration for URL rewriting and `iisnode` integration.
- **iisnode.yml**: Configuration for the `iisnode` module.
- **build-for-iis.bat**: Windows batch script to automate the build process for IIS.

## Main Files & Resources
- **app/layout.tsx**: Root layout for the application.
- **app/page.tsx**: Main landing page.
- **prisma/schema.prisma**: MongoDB schema definition for Users, Services, Appointments, etc.
- **auth.ts / auth.config.ts**: NextAuth.js configuration for authentication.
- **next.config.ts**: Next.js framework configuration.

## Data Model (Prisma/MongoDB)
Key models in the database:
- `User`: Admin users for the dashboard.
- `Service`: Legal services offered by the firm.
- `Appointment`: Consultation bookings.
- `Enquiry`: Contact form submissions.
- `CarouselSlide`: Homepage hero content.
- `Review`: Client testimonials.
