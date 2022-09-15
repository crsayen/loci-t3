import { z } from 'zod'
import {
  addLociToCollection,
  deleteCollection,
  getAllCollections,
  getAllCollectionsForUser,
  getCollection,
} from '../db/repository/collection'
import { ensureIsResourceOwner } from '../security/authorization'
import { createRouter } from './utility/context'

export const collectionsRouter = createRouter()
  .query('get', {
    input: z.object({ collectionId: z.string() }),
    async resolve({ ctx, input }) {
      return await getCollection(ctx.prisma, input.collectionId)
    },
  })
  .query('getAll', {
    async resolve({ ctx }) {
      return await getAllCollections(ctx.prisma)
    },
  })
  .query('getAllForUser', {
    input: z.object({ userId: z.string() }),
    async resolve({ ctx, input }) {
      return await getAllCollectionsForUser(ctx.prisma, input.userId)
    },
  })
  .mutation('addLoci', {
    input: z.object({
      collectionId: z.string(),
      loci: z.array(
        z.object({
          name: z.string(),
        })
      ),
    }),
    async resolve({ ctx, input }) {
      await ensureIsResourceOwner(ctx, input.collectionId, 'collection')
      if (ctx) return await addLociToCollection(ctx.prisma, input.collectionId, input.loci)
    },
  })
  .mutation('delete', {
    input: z.object({
      collectionId: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ensureIsResourceOwner(ctx, input.collectionId, 'collection')
      if (ctx) return await deleteCollection(ctx.prisma, input.collectionId)
    },
  })
