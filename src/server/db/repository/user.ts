import { PrismaClient } from '@prisma/client'

export async function getAllUsers(prisma: PrismaClient) {
  return await await prisma.user.findMany({
    select: { name: true, id: true },
  })
}

export async function getUserFromCollection(prisma: PrismaClient, id: string) {
  const collection = await prisma.collection.findFirst({
    where: { id },
    select: { ownerId: true },
  })
  return collection?.ownerId
}

export async function getUserFromLocus(prisma: PrismaClient, id: string) {
  const locus = await prisma.locus.findFirst({
    where: { id },
    select: { collection: { select: { ownerId: true } } },
  })
  return locus?.collection.ownerId
}

export async function getUserFromItem(prisma: PrismaClient, id: string) {
  const item = await prisma.item.findFirst({
    where: { id },
    select: {
      locus: {
        select: { collection: { select: { ownerId: true } } },
      },
    },
  })
  return item?.locus.collection.ownerId
}

export async function addCollectionToUser(prisma: PrismaClient, id: string, name: string) {
  return await prisma.user.update({
    where: { id },
    data: { collections: { create: { name } } },
  })
}

export async function getUserRolesAndPermissions(
  prisma: PrismaClient,
  id: string
): Promise<{ roles: string[]; permissions: string[] }> {
  const user = await prisma.user.findFirst({
    where: { id },
    select: {
      userRoles: {
        select: {
          role: {
            select: {
              name: true,
              rolePermissions: {
                select: { permission: { select: { authority: true } } },
              },
            },
          },
        },
      },
    },
  })
  const roles = user?.userRoles.map((userRole) => userRole.role.name) ?? []
  const permissions =
    user?.userRoles.flatMap((userRole) =>
      userRole.role.rolePermissions.map((rolePermission) => rolePermission.permission.authority)
    ) ?? []

  return { roles, permissions }
}

export async function grantUsersOwnRole(prisma: PrismaClient, id: string) {
  return await prisma.user.update({
    where: { id },
    data: {
      userRoles: {
        create: { role: { create: { name: id } } },
      },
    },
  })
}
