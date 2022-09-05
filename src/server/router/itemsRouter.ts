import { z } from 'zod'
import {
  getAllItemsFromCollection,
  getAllItemsFromLocus,
  updateItem,
} from '../db/repository/item'
import { createProtectedRouter } from './utility/protected-router'

export const itemsRouter = createProtectedRouter()
  .query('getAllForLocus', {
    input: z.object({ locusId: z.string() }),
    async resolve({ ctx, input }) {
      return await getAllItemsFromLocus(ctx.prisma, input.locusId)
    },
  })
  .query('getAllForCollection', {
    input: z.object({ collectionId: z.string() }),
    async resolve({ ctx, input }) {
      return await getAllItemsFromCollection(
        ctx.prisma,
        input.collectionId
      )
    },
  })
  .mutation('update', {
    input: z.object({
      itemId: z.string(),
      data: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        amount: z.number().positive().int().optional(),
      }),
    }),
    async resolve({ ctx, input }) {
      return await updateItem(ctx.prisma, input.itemId, input.data)
    },
  })
