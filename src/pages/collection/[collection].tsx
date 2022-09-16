import { PlusIcon } from '@heroicons/react/20/solid'
import Fuse from 'fuse.js'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import { CollectionListItem } from '../../components/collection/CollectionListItem'
import { MenuOpenProvider } from '../../components/collection/MenuOpenContext'
import { useLoading } from '../../components/Context/LoadingContext'
import Main from '../../components/Layout/Main'
import AddItemModal from '../../components/Modals/AddItemModal'
import AlertModal from '../../components/Modals/AlertModal'
import { WhenAllowed } from '../../components/security/WhenAllowed'
import { inferQueryOutput, trpc } from '../../utils/trpc'

type ItemsQueryOutput = inferQueryOutput<'items.getAllForCollection'>
type CollectionQueryOutput = inferQueryOutput<'collections.get'>

export type CollectionItem = ItemsQueryOutput[number]
export type CollectionOwner = CollectionQueryOutput['owner']

export default function ItemsPage() {
  const { setLoading } = useLoading()
  const [user, setUser] = useState<{
    name: string | null
    id: string
  }>()
  const router = useRouter()
  const collectionId = router.query.collection as string
  const itemsQuery = trpc.useQuery(['items.getAllForCollection', { collectionId }])
  const collectionQuery = trpc.useQuery(['collections.get', { collectionId }])
  const [fuse, setFuse] = useState<Fuse<inferQueryOutput<'items.getAllForCollection'>[number]>>()
  const [filteredItems, setFilteredItems] = useState<inferQueryOutput<'items.getAllForCollection'>>()
  const [addItemModalOpen, setAddItemModalOpen] = useState<boolean>(false)
  const [alertModalOpen, setAlertModalOpen] = useState<boolean>(false)
  const [showSearch, setShowSearch] = useState<boolean>(false)

  const handleFilter = (event: ChangeEvent<HTMLInputElement>) => {
    const filterText = event.target.value
    if (filterText === '') return setFilteredItems(undefined)
    const result = fuse?.search(filterText)
    if (!result) {
      throw 'Error filtering items'
    }
    setFilteredItems(
      result.map((i) => {
        return i.item
      })
    )
  }

  useEffect(() => {
    const show = (itemsQuery?.data?.length ?? 0) > 10
    setShowSearch(show)
    if (show) {
      const fuse = new Fuse(itemsQuery.data ?? [], { keys: ['name', 'locus.name'], threshold: 0.8, distance: 100 })
      setFuse(fuse)
    }
  }, [itemsQuery.data])

  useEffect(() => {
    setLoading(itemsQuery.isLoading)
  }, [itemsQuery.isLoading, setLoading])

  useEffect(() => {
    setUser(collectionQuery.data?.owner)
  }, [collectionQuery.data?.owner])

  return (
    <Main>
      <AlertModal open={alertModalOpen} onClose={() => setAlertModalOpen(false)} message="Nothing here yet!!1" />
      <div
        className="-mt-1 absolute mx-auto py-2 z-10 flex flex-row items-end 
      gap-5 justify-start bg-black w-full pr-auto"
      >
        <div className="flex flex-row justify-start items-center gap-4">
          {showSearch && (
            <div className="w-60">
              <input
                type="text"
                placeholder="filter"
                onChange={handleFilter}
                className="w-full shadow-sm sm:text-sm rounded-md bg-neutral-900 
                focus:border-neutral-500 focus:outline-none focus:ring-1 
                focus:ring-neutral-500 block border-neutral-600"
              />
            </div>
          )}
          <div>
            <WhenAllowed resourceOwner={user?.id} resourceType="collection" actionType="write">
              <AddItemModal
                open={addItemModalOpen}
                collectionId={collectionId}
                onClose={() => setAddItemModalOpen(false)}
              />
              <button
                type="button"
                className="inline-flex items-center p-1 border border-transparent 
              rounded-full shadow-sm text-white bg-white 
              hover:bg-neutral-300 focus:outline-none focus:ring-2 
              focus:ring-offset-1 focus:ring-neutral-500 disabled:outline-none 
              disabled:hover:bg-neutral-500 disabled:bg-neutral-500"
                onClick={() => setAddItemModalOpen(true)}
              >
                <PlusIcon className="h-3 w-3" stroke="#000000" />
              </button>
            </WhenAllowed>
          </div>
        </div>
      </div>
      <div className="mt-15">
        <MenuOpenProvider>
          {(filteredItems ?? itemsQuery.data)?.map((item, i) => (
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            <CollectionListItem key={i} owner={user!} item={item} />
          ))}
        </MenuOpenProvider>
      </div>
    </Main>
  )
}
