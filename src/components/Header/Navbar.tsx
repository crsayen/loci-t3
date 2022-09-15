import { useSession } from 'next-auth/react'
import Link from 'next/link'
import LoginButton from './LoginButton'

export default function Navbar() {
  const { data: session } = useSession()
  return (
    <div className="header flex flex-row-reverse justify-between items-center px-2">
      <div>
        <LoginButton />
      </div>
      {session !== null && (
        <Link href={'/'}>
          <div className="text-violet-300 h-min text-xs cursor-pointer hover:text-violet-200 px-1">
            {session?.user?.name}
          </div>
        </Link>
      )}
    </div>
  )
}
