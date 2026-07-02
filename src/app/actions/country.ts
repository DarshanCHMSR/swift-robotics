'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getCountries() {
  return await prisma.country.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function addCountry(data: { name: string; status?: boolean }) {
  const result = await prisma.country.create({
    data: {
      name: data.name,
      status: data.status ?? true,
    },
  })
  revalidatePath('/countries')
  return result
}

export async function updateCountry(id: number, data: { name?: string; status?: boolean }) {
  const result = await prisma.country.update({
    where: { id },
    data,
  })
  revalidatePath('/countries')
  return result
}

export async function deleteCountry(id: number) {
  const result = await prisma.country.delete({
    where: { id },
  })
  revalidatePath('/countries')
  return result
}
