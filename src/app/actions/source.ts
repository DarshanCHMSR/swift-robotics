'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getSources() {
  return await prisma.source.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function addSource(data: { name: string; apiUrl: string; enabled?: boolean }) {
  const result = await prisma.source.create({
    data: {
      name: data.name,
      apiUrl: data.apiUrl,
      enabled: data.enabled ?? true,
    },
  })
  revalidatePath('/sources')
  return result
}

export async function updateSource(id: number, data: { name?: string; apiUrl?: string; enabled?: boolean }) {
  const result = await prisma.source.update({
    where: { id },
    data,
  })
  revalidatePath('/sources')
  return result
}

export async function deleteSource(id: number) {
  const result = await prisma.source.delete({
    where: { id },
  })
  revalidatePath('/sources')
  return result
}
