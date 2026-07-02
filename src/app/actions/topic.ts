'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getTopics() {
  return await prisma.topic.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function addTopic(data: { name: string; keywords: string; enabled?: boolean }) {
  const result = await prisma.topic.create({
    data: {
      name: data.name,
      keywords: data.keywords,
      enabled: data.enabled ?? true,
    },
  })
  revalidatePath('/topics')
  return result
}

export async function updateTopic(id: number, data: { name?: string; keywords?: string; enabled?: boolean }) {
  const result = await prisma.topic.update({
    where: { id },
    data,
  })
  revalidatePath('/topics')
  return result
}

export async function deleteTopic(id: number) {
  const result = await prisma.topic.delete({
    where: { id },
  })
  revalidatePath('/topics')
  return result
}
