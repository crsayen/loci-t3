import { useEffect } from 'react'
import { useLoading } from '../../components/Context/LoadingContext'
import NavList from '../../components/Lists/NavList'
import { env } from '../../env/client.mjs'
import { trpc } from '../../utils/trpc'

export default function UsersPage() {
  const { isLoading, data } = trpc.useQuery(['users.getAll'])
  const { setLoading } = useLoading()

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading, setLoading])

  if (!data?.length) {
    return <div>try logging in</div>
  }

  return (
    <NavList
      items={
        data?.map((u) => {
          const path = `${env.NEXT_PUBLIC_BASE_URI}/collection`
          return {
            text: u.name ?? 'some user',
            path,
          }
        }) ?? []
      }
    />
  )
}
