// src/pages/api/trpc/[trpc].ts
import { createNextApiHandler } from '@trpc/server/adapters/next'
import { appRouter } from '../../../server/router'
import { createContext } from '../../../server/router/utility/context'

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
})
