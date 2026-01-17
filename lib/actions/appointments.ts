'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getAppointments() {
  const appointments = await prisma.appointment.findMany({
    orderBy: {
      date: 'desc',
    },
  });
  return appointments;
}

export async function updateAppointmentStatus(id: string, status: string) {
  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status },
  });
  revalidatePath('/admin/appointments');
  return appointment;
}

export async function getUnavailableDates() {
  const appointments = await prisma.appointment.findMany({
    where: {
      OR: [
        { status: 'ACCEPTED' },
        { status: 'BLOCKED' },
      ],
      date: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
    select: {
      date: true,
      time: true,
      status: true,
    },
  });
  return appointments;
}

export async function blockDate(date: Date, time: string) {
  const appointment = await prisma.appointment.create({
    data: {
      name: time === 'ALL_DAY' ? 'WHOLE DAY BLOCKED' : 'SLOT BLOCKED',
      email: 'admin@biolaw.com',
      phone: 'N/A',
      date,
      time,
      service: 'N/A',
      status: 'BLOCKED',
    },
  });
  revalidatePath('/admin/appointments');
  revalidatePath('/'); // Revalidate home page where appointment form is
  return appointment;
}

export async function deleteAppointment(id: string) {
  await prisma.appointment.delete({
    where: { id },
  });
  revalidatePath('/admin/appointments');
}
