import { useEffect } from 'react'
import { useLoading } from '../../components/Context/LoadingContext'
import Main from '../../components/Layout/Main'
import NavList from '../../components/Lists/NavList'
import { env } from '../../env/client.mjs'
import { trpc } from '../../utils/trpc'

export default function CollectionsPage() {
  const { setLoading } = useLoading()
  const { isLoading, data } = trpc.useQuery(['collections.getAll'])

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading, setLoading])

  return (
    <Main>
      <div className="mt-20">
        <NavList
          items={
            data?.map((c) => {
              return {
                text: c.name,
                path: `${env.NEXT_PUBLIC_BASE_URI}/collection/${c.id}`,
              }
            }) ?? []
          }
        />
      </div>
    </Main>
  )
}
