import { useSession } from 'next-auth/react'
import LoginButton from './LoginButton'

export default function Navbar() {
  const { data: session } = useSession()
  return (
    <div className="header flex flex-row-reverse justify-between items-center px-2">
      <div>
        <LoginButton />
      </div>
      {session !== null && <div className="colorpop h-min text-xs">{session?.user?.name}</div>}
    </div>
  )
}
