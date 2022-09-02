import React from 'react'
import Button from '../Elements/Button'
import { useSession, signIn, signOut } from 'next-auth/react'

const LoginButton = () => {
  const { data: session } = useSession()
  if (session) return <Button onClick={() => signOut()}>Sign out</Button>
  return <Button onClick={() => signIn()}>Sign in</Button>
}

export default LoginButton
