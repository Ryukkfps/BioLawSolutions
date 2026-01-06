'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createSlide(data: { title: string; subtitle: string; description: string; image: string; ctaText: string; order?: number; isActive?: boolean }) {
  const slide = await prisma.carouselSlide.create({
    data,
  });
  revalidatePath('/');
  revalidatePath('/admin/carousel');
  return slide;
}

export async function updateSlide(id: string, data: { title?: string; subtitle?: string; description?: string; image?: string; ctaText?: string; order?: number; isActive?: boolean }) {
  const slide = await prisma.carouselSlide.update({
    where: { id },
    data,
  });
  revalidatePath('/');
  revalidatePath('/admin/carousel');
  return slide;
}

export async function deleteSlide(id: string) {
  await prisma.carouselSlide.delete({
    where: { id },
  });
  revalidatePath('/');
  revalidatePath('/admin/carousel');
}
