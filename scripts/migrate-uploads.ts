import "dotenv/config";
import { PrismaClient } from '../lib/generated/client';
import { copyFile, mkdir, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function migrateUploads() {
  console.log('Starting upload migration...');

  const oldUploadsDir = path.join(process.cwd(), 'public', 'uploads');
  const newUploadsDir = path.join(process.cwd(), 'uploads');

  // Create new uploads directory
  if (!existsSync(newUploadsDir)) {
    await mkdir(newUploadsDir, { recursive: true });
    console.log('Created new uploads directory');
  }

  // Copy files from old to new location
  if (existsSync(oldUploadsDir)) {
    const files = await readdir(oldUploadsDir);
    console.log(`Found ${files.length} files to migrate`);

    for (const file of files) {
      const oldPath = path.join(oldUploadsDir, file);
      const newPath = path.join(newUploadsDir, file);
      
      if (!existsSync(newPath)) {
        await copyFile(oldPath, newPath);
        console.log(`Copied: ${file}`);
      } else {
        console.log(`Skipped (already exists): ${file}`);
      }
    }
  } else {
    console.log('No old uploads directory found, skipping file copy');
  }

  // Update database paths
  console.log('\nUpdating database paths...');

  // Update Content table
  const contents = await prisma.content.findMany({
    where: {
      backgroundImage: {
        startsWith: '/uploads/'
      }
    }
  });

  for (const content of contents) {
    if (content.backgroundImage) {
      const newPath = content.backgroundImage.replace('/uploads/', '/api/uploads/');
      await prisma.content.update({
        where: { id: content.id },
        data: { backgroundImage: newPath }
      });
      console.log(`Updated content ${content.id}: ${content.backgroundImage} -> ${newPath}`);
    }
  }

  // Update CarouselSlide table
  const slides = await prisma.carouselSlide.findMany({
    where: {
      image: {
        startsWith: '/uploads/'
      }
    }
  });

  for (const slide of slides) {
    if (slide.image) {
      const newPath = slide.image.replace('/uploads/', '/api/uploads/');
      await prisma.carouselSlide.update({
        where: { id: slide.id },
        data: { image: newPath }
      });
      console.log(`Updated carousel slide ${slide.id}: ${slide.image} -> ${newPath}`);
    }
  }

  // Update AboutSection table
  const aboutSections = await prisma.aboutSection.findMany({
    where: {
      image: {
        startsWith: '/uploads/'
      }
    }
  });

  for (const section of aboutSections) {
    if (section.image) {
      const newPath = section.image.replace('/uploads/', '/api/uploads/');
      await prisma.aboutSection.update({
        where: { id: section.id },
        data: { image: newPath }
      });
      console.log(`Updated about section ${section.id}: ${section.image} -> ${newPath}`);
    }
  }

  console.log('\nMigration completed successfully!');
}

migrateUploads()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
