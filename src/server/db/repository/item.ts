import { Prisma, PrismaClient } from '@prisma/client'

export async function getAllItemsFromLocus(prisma: PrismaClient, locusId: string) {
  return await getAllItemsWhere(prisma, { locusId })
}

export async function getAllItemsFromCollection(prisma: PrismaClient, collectionId: string) {
  return await getAllItemsWhere(prisma, { locus: { collectionId } })
}

async function getAllItemsWhere(prisma: PrismaClient, where: Prisma.ItemWhereInput) {
  return await prisma.item.findMany({
    where,
    select: {
      name: true,
      id: true,
      createdAt: true,
      amount: true,
      locus: { select: { id: true, name: true } },
    },
  })
}

export async function updateItem(prisma: PrismaClient, id: string, data: Prisma.ItemUpdateInput) {
  return await prisma.item.update({ where: { id }, data })
}

export async function deleteItem(prisma: PrismaClient, id: string) {
  return await prisma.item.delete({ where: { id } })
}
