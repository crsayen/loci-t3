import { useRouter } from 'next/router'
import Main from '../../components/Layout/Main'
import NavList from '../../components/Lists/NavList'
import { env } from '../../env/client.mjs'
import { trpc } from '../../utils/trpc'

export default function ItemsPage() {
  const router = useRouter()
  const { isLoading, data } = trpc.useQuery(['collection.get', router.query.collection as string])

  if (isLoading || !data) return <>loading...</>

  return (
    <Main>
      <div className="mt-20">
        <NavList
          items={
            data?.collection?.Locus?.flatMap((l) =>
              l.items.map((i) => {
                return {
                  text: i.name,
                  path: `${env.NEXT_PUBLIC_BASE_URI}/items/${i.id}`,
                }
              })
            ) ?? []
          }
        />
      </div>
    </Main>
  )
}
