// src/server/router/index.ts
import { createRouter } from './context'
import superjson from 'superjson'
import { usersRouter } from './users'
import { protectedExampleRouter } from './protected-example-router'
import { collectionRouter } from './collection'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('users.', usersRouter)
  .merge('auth.', protectedExampleRouter)
  .merge('collection.', collectionRouter)

// export type definition of API
export type AppRouter = typeof appRouter
