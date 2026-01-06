'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function approveReview(id: string) {
  const review = await prisma.review.update({
    where: { id },
    data: { isApproved: true },
  });
  revalidatePath('/');
  revalidatePath('/admin/reviews');
  return review;
}

export async function deleteReview(id: string) {
  await prisma.review.delete({
    where: { id },
  });
  revalidatePath('/');
  revalidatePath('/admin/reviews');
}
