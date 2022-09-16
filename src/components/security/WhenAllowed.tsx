import { useSession } from 'next-auth/react'
import { ReactNode, useEffect, useState } from 'react'
import { ActionType, hasAuthority, ResourceType } from './authorization'

interface Props {
  resourceOwner: string | undefined | null
  resourceType: ResourceType
  actionType: ActionType
  children: ReactNode
}

export function WhenAllowed(props: Props) {
  const session = useSession()
  const [canAct, setCanAct] = useState<boolean>(false)

  useEffect(() => {
    const owner = props.resourceOwner
    if (!owner) return setCanAct(false)
    setCanAct(hasAuthority(session.data, 'collection', owner, 'write'))
  }, [props.resourceOwner, session])

  return canAct ? <>{props.children}</> : <></>
}
