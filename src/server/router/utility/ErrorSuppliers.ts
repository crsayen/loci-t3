import { TRPCError } from '@trpc/server'

export const lacksAuthority = () => {
  return new TRPCError({
    code: 'FORBIDDEN',
    message: 'Caller lacks the required permission(s)',
  })
}

export const notFound = (message: string) => {
  return new TRPCError({
    code: 'NOT_FOUND',
    message,
  })
}
