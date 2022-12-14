import { z } from 'zod'
import {
  deleteItem,
  getAllItemsFromCollection,
  getAllItemsFromLocus,
  getItemsFromCollectionByName,
  updateItem,
  updateItemLocus,
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
  .query('getAncestorLoci', {
    input: z.object({ collectionId: z.string(), locusName: z.string() }),
    async resolve({ ctx, input }) {
      const getLocusLocus = async (locus: string) => {
        const locusItems = await getItemsFromCollectionByName(ctx.prisma, input.collectionId, locus)
        if (locusItems.length == 0) return null
        return locusItems[0]?.locus.name
      }
      let currentLocus = input.locusName
      let parent: string | null | undefined = null
      const ancestors: string[] = []
      do {
        parent = await getLocusLocus(currentLocus)
        if (parent) {
          currentLocus = parent
          ancestors.push(parent)
        }
      } while (parent)
      return ancestors
    },
  })
  .mutation('update', {
    input: z.object({
      itemId: z.string(),
      data: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        amount: z.number().nonnegative().int().optional(),
        amountCheckedOut: z.number().nonnegative().int().optional(),
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
  .mutation('move', {
    input: z.object({
      itemId: z.string(),
      locusId: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ensureIsResourceOwner(ctx, input.itemId, 'item')
      await ensureIsResourceOwner(ctx, input.locusId, 'locus')
      return await updateItemLocus(ctx.prisma, input.itemId, input.locusId)
    },
  })
