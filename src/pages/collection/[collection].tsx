import { PlusIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import Main from '../../components/Layout/Main'
import Fuse from 'fuse.js'
import { env } from '../../env/client.mjs'
import { inferQueryOutput, trpc } from '../../utils/trpc'
import AddItemModal from '../../components/Modals/AddItemModal'
import ConfirmationModal from '../../components/Modals/ConfirmationModal'
import Link from 'next/link'

export default function ItemsPage() {
  const router = useRouter()
  const collectionId = router.query.collection as string
  const itemsQuery = trpc.useQuery(['items.getAllForCollection', { collectionId }])
  const deleteItemMutation = trpc.useMutation('items.delete')
  const [fuse, setFuse] = useState<Fuse<inferQueryOutput<'items.getAllForCollection'>[number]>>()
  const [filteredItems, setFilteredItems] = useState<inferQueryOutput<'items.getAllForCollection'>>()
  const [addItemModalOpen, setAddItemModalOpen] = useState<boolean>(false)
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false)
  const [itemToDelete, setItemToDelete] = useState<{ name: string; id: string } | undefined>()

  useEffect(() => {
    console.log('didddur chchch')
    const show = (itemsQuery?.data?.length ?? 0) > 10
    setShowSearch(show)
    if (show) {
      const fuse = new Fuse(itemsQuery.data ?? [], { keys: ['name', 'locus.name'] })
      setFuse(fuse)
    }
  }, [itemsQuery.data])

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

  const handleDeleteItem = async (id: string, name: string) => {
    setItemToDelete({ id, name })
    setConfirmDeleteOpen(true)
  }

  const handleConfirm = (confirmed: boolean) => {
    const { id } = itemToDelete as { id: string }
    setItemToDelete(undefined)
    if (!confirmed) return
    deleteItemMutation.mutate({ itemId: id })
  }

  //TODO: this sucks. do good stuff
  if (itemsQuery.isLoading) return <>loading...</>

  return (
    <Main>
      <ConfirmationModal open={confirmDeleteOpen} onClose={handleConfirm} message={`Delete "${itemToDelete?.name}"?`} />
      <AddItemModal open={addItemModalOpen} collectionId={collectionId} onClose={() => setAddItemModalOpen(false)} />
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
            <button
              type="button"
              className="inline-flex items-center p-1 border border-transparent 
              rounded-full shadow-sm text-white bg-white 
              hover:bg-neutral-300 focus:outline-none focus:ring-2 
              focus:ring-offset-1 focus:ring-neutral-500"
              onClick={() => setAddItemModalOpen(true)}
            >
              <PlusIcon className="h-3 w-3" stroke="#000000" />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <div>
          {(filteredItems ?? itemsQuery.data)?.map((item) => (
            <div key={item.id}>
              <div className="flex flex-row">
                <Link href={`${env.NEXT_PUBLIC_BASE_URI}/items/${item.id}`}>
                  <div
                    className="whitespace-nowrap overflow-hidden pl-4 py-2 w-full 
                  cursor-pointer rounded-lg hover:bg-gradient-to-r 
                  hover:to-black hover:from-neutral-800"
                  >
                    {item.name}
                  </div>
                </Link>
                <div className="ml-3 mt-2">
                  <button
                    type="button"
                    className="inline-flex items-center p-1 rounded-full shadow-sm bg-black 
                    hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-1 
                    focus:ring-neutral-800"
                    onClick={() => handleDeleteItem(item.id, item.name)}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-neutral-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Main>
  )
}
