import { z } from 'zod'
import {
  addLociToCollection,
  getAllCollections,
  getAllCollectionsForUser,
} from '../db/repository/collection'
import { createProtectedRouter } from './utility/protected-router'

export const collectionsRouter = createProtectedRouter()
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
      return await addLociToCollection(
        ctx.prisma,
        input.collectionId,
        input.loci
      )
    },
  })
