import { TRPCError } from '@trpc/server'

export const lacksAuthority = () => {
  return new TRPCError({
    code: 'FORBIDDEN',
    message: 'Caller lacks the required permission(s)',
  })
}
