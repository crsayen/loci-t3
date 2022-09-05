import { PlusIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Main from '../../components/Layout/Main'
import NavList from '../../components/Lists/NavList'
import { env } from '../../env/client.mjs'
import { trpc } from '../../utils/trpc'

export default function ItemsPage() {
  const router = useRouter()
  const collectionId = router.query.collection as string
  const getCollectionQuery = trpc.useQuery(['collection.get', { collectionId }])
  trpc.useQuery(['collection.getLoci', { collectionId }])

  if (getCollectionQuery.isLoading) return <>loading...</>

  return (
    <Main>
      <div className="-mt-1 absolute mx-auto py-2 z-10 flex flex-row items-end gap-5 justify-start bg-black w-full pr-auto">
        <div className="flex flex-row justify-start items-center gap-4">
          {listItems.length > 10 && (
            <div className="w-60">
              <Search items={listItems.map((i) => i.text)} onSelect={handleSelect} />
            </div>
          )}
          <div>
            <button
              type="button"
              className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-white hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-neutral-500"
              onClick={() => setAddItemModalOpen(true)}
            >
              <PlusIcon className="h-3 w-3" stroke="#000000" />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <NavList
          items={
            // TODO: make a better query so don't have to do this
            getCollectionQuery.data?.collection?.Locus?.flatMap((l) =>
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
