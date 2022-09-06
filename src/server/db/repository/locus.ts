import { Prisma, PrismaClient } from '@prisma/client'

export async function getAllLociInCollection(
  prisma: PrismaClient,
  collectionId: string
) {
  return await getAllLociWhere(prisma, { collectionId })
}

async function getAllLociWhere(
  prisma: PrismaClient,
  where: Prisma.LocusWhereInput
) {
  return await await prisma.locus.findMany({
    where,
    select: {
      name: true,
      id: true,
      collection: {
        select: {
          id: true,
          owner: { select: { id: true, name: true } },
          name: true,
        },
      },
    },
  })
}

type Items = {
  name: string
  amount: number
  description: string
}[]

export async function addItemsToLoci(
  prisma: PrismaClient,
  id: string,
  items: Items
) {
  await prisma.locus.update({
    where: { id },
    data: { items: { createMany: { data: items } } },
  })
}

export async function createLoci(
  prisma: PrismaClient,
  collectionId: string,
  name: string,
  items: Items
) {
  await prisma.locus.create({
    data: {
      name,
      collectionId,
      items: { createMany: { data: items } },
    },
  })
}
