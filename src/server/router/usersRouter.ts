import { z } from 'zod'
import {
  addCollectionToUser,
  getAllUsers,
} from '../db/repository/user'
import { createProtectedRouter } from './utility/protected-router'

export const usersRouter = createProtectedRouter()
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
      await addCollectionToUser(
        ctx.prisma,
        input.userId,
        input.collectionName
      )
    },
  })
