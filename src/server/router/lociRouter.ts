import { z } from 'zod'
import { addItemsToLoci, createLoci, getAllLociInCollection } from '../db/repository/locus'
import { ensureIsResourceOwner } from '../security/authorization'
import { createRouter } from './utility/context'

export const lociRouter = createRouter()
  .query('getAllForCollection', {
    input: z.object({ collectionId: z.string() }),
    async resolve({ ctx, input }) {
      return await getAllLociInCollection(ctx.prisma, input.collectionId)
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
      await ensureIsResourceOwner(ctx, input.locusId, 'locus')
      return await addItemsToLoci(ctx.prisma, input.locusId, input.items)
    },
  })
  .mutation('create', {
    input: z.object({
      name: z.string(),
      collectionId: z.string(),
      items: z.array(
        z.object({
          name: z.string(),
          amount: z.number().positive().int(),
          description: z.string(),
        })
      ),
    }),
    async resolve({ ctx, input }) {
      await ensureIsResourceOwner(ctx, input.collectionId, 'collection')
      return await createLoci(ctx.prisma, input.collectionId, input.name, input.items)
    },
  })
// power brick barrel 12v 1a
// macbook charger 95w usb c
// power brick barrel 12v 2a
// battery charger 8x aa aaa
// battery charger nitecore
// power brick barrel 9v 1a
// power brick barrel 12v 0.15a
// power brick barrel 9v 0.5a
// power brick barrel 15v 0.2a
// power brick barrel 5v 2.1a
// power brick barrel 24v 4.5a
// power brick barrel 19v 3.95a
