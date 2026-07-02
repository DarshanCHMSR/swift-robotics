'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getCompetitors() {
  return await prisma.competitor.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function addCompetitor(data: { name: string; enabled?: boolean }) {
  const result = await prisma.competitor.create({
    data: {
      name: data.name,
      enabled: data.enabled ?? true,
    },
  })
  revalidatePath('/competitors')
  return result
}

export async function updateCompetitor(id: number, data: { name?: string; enabled?: boolean }) {
  const result = await prisma.competitor.update({
    where: { id },
    data,
  })
  revalidatePath('/competitors')
  return result
}

export async function deleteCompetitor(id: number) {
  const result = await prisma.competitor.delete({
    where: { id },
  })
  revalidatePath('/competitors')
  return result
}
