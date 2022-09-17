import { PrismaClient } from '@prisma/client'
import { getUserFromCollection, getUserFromItem, getUserFromLocus } from '../db/repository/user'
import { Context } from '../router/utility/context'
import { lacksAuthority } from '../router/utility/ErrorSuppliers'

type ResourceType = 'item' | 'collection' | 'locus'
type UserIdResolver = (prisma: PrismaClient, id: string) => Promise<string | undefined>

const resolvers: Record<ResourceType, UserIdResolver> = {
  item: getUserFromItem,
  collection: getUserFromCollection,
  locus: getUserFromLocus,
}

export async function isResourceOwner(
  ctx: Context,
  resourceId: string,
  resourceType: ResourceType
) {
  const ownerId = await resolvers[resourceType](ctx.prisma, resourceId)
  return ownerId === ctx?.session?.user?.id
}

export async function ensureIsResourceOwner(
  ctx: Context,
  resourceId: string,
  resourceType: ResourceType
) {
  console.log('ensureIsResourceOwner:', resourceId, resourceType)
  const isOwner = await isResourceOwner(ctx, resourceId, resourceType)
  console.log('ensureIsResourceOwner: isOwner', isOwner)
  if (!isOwner) throw lacksAuthority()
}
