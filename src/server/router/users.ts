import { createProtectedRouter } from './protected-router'

export const usersRouter = createProtectedRouter().query('getAll', {
  async resolve({ ctx }) {
    return await ctx.prisma.user.findMany()
  },
})
