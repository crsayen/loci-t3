import { Session } from 'next-auth'

// TODO: make room for 'public' designation maybe?
export function hasAuthority(
  session: Session | null,
  resource: string,
  owner: string,
  action: string
) {
  if (!session) return false
  if (session?.user?.roles.includes(owner)) return true
  if (session?.user?.permissions.includes(`${resource}.any.${action}`)) return true
  return false
}
