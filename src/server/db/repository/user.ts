import { PrismaClient } from '@prisma/client'

export async function getAllUsers(prisma: PrismaClient) {
  return await await prisma.user.findMany({
    select: { name: true, id: true },
  })
}

export async function addCollectionToUser(
  prisma: PrismaClient,
  id: string,
  name: string
) {
  await prisma.user.update({
    where: { id },
    data: { collections: { create: { name } } },
  })
}
