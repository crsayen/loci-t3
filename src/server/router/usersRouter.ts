import { z } from 'zod'
import { addCollectionToUser, getAllUsers } from '../db/repository/user'
import { createRouter } from './utility/context'

export const usersRouter = createRouter()
  .query('getAll', {
    async resolve({ ctx }) {
      return await getAllUsers(ctx.prisma)
    },
  })
  .mutation('addCollection', {
    input: z.object({
      userId: z.string(),
      collectionName: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await addCollectionToUser(ctx.prisma, input.userId, input.collectionName)
    },
  })
