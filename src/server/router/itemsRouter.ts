import { z } from 'zod'
import {
  deleteItem,
  getAllItemsFromCollection,
  getAllItemsFromLocus,
  updateItem,
} from '../db/repository/item'
import { ensureIsResourceOwner } from '../security/authorization'
import { createRouter } from './utility/context'

export const itemsRouter = createRouter()
  .query('getAllForLocus', {
    input: z.object({ locusId: z.string() }),
    async resolve({ ctx, input }) {
      return await getAllItemsFromLocus(ctx.prisma, input.locusId)
    },
  })
  .query('getAllForCollection', {
    input: z.object({ collectionId: z.string() }),
    async resolve({ ctx, input }) {
      return await getAllItemsFromCollection(ctx.prisma, input.collectionId)
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
      await ensureIsResourceOwner(ctx, input.itemId, 'item')
      return await updateItem(ctx.prisma, input.itemId, input.data)
    },
  })
  .mutation('delete', {
    input: z.object({
      itemId: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ensureIsResourceOwner(ctx, input.itemId, 'item')
      return await deleteItem(ctx.prisma, input.itemId)
    },
  })
