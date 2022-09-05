import { z } from 'zod'
import {
  addItemsToLoci,
  getAllLociInCollection,
} from '../db/repository/locus'
import { createProtectedRouter } from './utility/protected-router'

export const lociRouter = createProtectedRouter()
  .query('getAllForCollection', {
    input: z.object({ collectionId: z.string() }),
    async resolve({ ctx, input }) {
      return await getAllLociInCollection(
        ctx.prisma,
        input.collectionId
      )
    },
  })
  .mutation('addItems', {
    input: z.object({
      locusId: z.string(),
      items: z.array(
        z.object({
          name: z.string(),
          amount: z.number().positive().int(),
          description: z.string(),
        })
      ),
    }),
    async resolve({ ctx, input }) {
      return await addItemsToLoci(
        ctx.prisma,
        input.locusId,
        input.items
      )
    },
  })
