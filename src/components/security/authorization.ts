import { Session } from 'next-auth'

export type ResourceType = 'collection' | 'user' | 'item'
export type ActionType = 'write'

// TODO: make room for 'public' designation maybe?
export function hasAuthority(
  session: Session | null,
  resource: ResourceType,
  owner: string,
  action: ActionType
) {
  if (!session) return false
  if (session?.user?.roles.includes(owner)) return true
  if (session?.user?.permissions.includes(`${resource}.any.${action}`)) return true
  return false
}

// shea cmah7llic09520djrcnwfawmt
// chris cl7jra7e90024vxrn46syke5d