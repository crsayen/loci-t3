import { useEffect } from 'react'
import { useLoading } from '../../components/Context/LoadingContext'
import NavList from '../../components/Lists/NavList'
import { env } from '../../env/client.mjs'
import { trpc } from '../../utils/trpc'

export default function UsersPage() {
  const { isLoading, data } = trpc.useQuery(['users.getAll'])
  const { setLoading } = useLoading()
  // const [users, setUsers] = useState<Array<NavListItem>>([])
  // const { setLoading } = useLoading()
  // const { getIdTokenClaims } = useAuth0()

  // async function fetchItems(): Promise<Array<NavListItem>> {
  //   const itemData = await getData<UserListData>(`${BASE_URI}/api/users`, getIdTokenClaims)
  //   if (!itemData) return []
  //   return itemData.users.map((i) => {
  //     const path = `${BASE_URI}/users/${encodeURIComponent(i.id)}/collections`
  //     return {
  //       text: i.nickname,
  //       path,
  //     }
  //   })
  // }

  // useEffect(() => {
  //   setLoading(true)
  //   fetchItems().then((items) => {
  //     setUsers(items)
  //     setLoading(false)
  //   })
  // }, [])

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading, setLoading])

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
