import { Prisma, PrismaClient } from '@prisma/client'

export async function getCollection(prisma: PrismaClient, id: string) {
  return await prisma.collection.findFirst({
    where: { id },
    select: {
      name: true,
      id: true,
      owner: { select: { id: true, name: true } },
    },
  })
}

export async function getAllCollections(prisma: PrismaClient) {
  return await getAllCollectionsWhere(prisma, {})
}

export async function getAllCollectionsForUser(prisma: PrismaClient, ownerId: string) {
  return await getAllCollectionsWhere(prisma, { ownerId })
}

export async function getAllCollectionsWhere(
  prisma: PrismaClient,
  where: Prisma.CollectionWhereInput
) {
  return await prisma.collection.findMany({
    where,
    select: {
      name: true,
      id: true,
      owner: { select: { id: true, name: true } },
    },
  })
}

type Loci = {
  name: string
}[]

export async function addLociToCollection(prisma: PrismaClient, id: string, loci: Loci) {
  return await prisma.collection.update({
    where: { id },
    data: { loci: { createMany: { data: loci } } },
  })
}
