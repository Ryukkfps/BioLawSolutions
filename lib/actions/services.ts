'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createService(data: { title: string; description: string; icon?: string; order?: number; isActive?: boolean }) {
  const service = await prisma.service.create({
    data,
  });
  revalidatePath('/');
  revalidatePath('/admin/services');
  return service;
}

export async function updateService(id: string, data: { title?: string; description?: string; icon?: string; order?: number; isActive?: boolean }) {
  const service = await prisma.service.update({
    where: { id },
    data,
  });
  revalidatePath('/');
  revalidatePath('/admin/services');
  return service;
}

export async function deleteService(id: string) {
  await prisma.service.delete({
    where: { id },
  });
  revalidatePath('/');
  revalidatePath('/admin/services');
}
