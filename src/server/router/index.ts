// src/server/router/index.ts
import { createRouter } from './utility/context'
import superjson from 'superjson'
import { usersRouter } from './usersRouter'
import { collectionsRouter } from './collectionsRouter'
import { lociRouter } from './lociRouter'
import { itemsRouter } from './itemsRouter'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('users.', usersRouter)
  .merge('collections.', collectionsRouter)
  .merge('loci.', lociRouter)
  .merge('items.', itemsRouter)

// export type definition of API
export type AppRouter = typeof appRouter
