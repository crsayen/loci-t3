import { z } from 'zod'
import { createProtectedRouter } from './protected-router'

export const collectionRouter = createProtectedRouter()
  .query('getAll', {
    async resolve({ ctx }) {
      return await (
        await ctx.prisma.collection.findMany({ select: { name: true, id: true, owner: { select: { name: true } } } })
      ).map((c) => {
        return {
          id: c.id,
          name: c.name,
          owner: c.owner.name,
        }
      })
    },
  })
  .query('get', {
    input: z.string().nullish(),
    async resolve({ ctx, input }) {
      return {
        collection: await ctx.prisma.collection.findFirst({
          where: { id: input ?? undefined },
          select: {
            name: true,
            Locus: { select: { id: true, items: { select: { name: true, locusId: true, id: true } }, name: true } },
          },
        }),
      }
    },
  })
  .mutation('add', {
    input: z.object({
      collectionId: z.string(),
      items: z.array(
        z.object({
          name: z.string(),
          locus: z.object({
            id: z.string(),
            name: z.string(),
          }),
          locusName: z.string(),
          count: z.number(),
        })
      ),
    }),
    async resolve({ ctx, input }) {
      const data = input.items.map((i) => {
        return {
          name: i.name,
          locusId: i.locus.id,
          Locus: {
            connectOrCreate: { where: { id: i.locus.id, name: i.locus.name } },
          },
          amount: i.count,
        }
      })

      ctx.prisma.item.createMany({
        data,
      })
    },
  })
