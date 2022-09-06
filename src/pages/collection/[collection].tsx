import { PlusIcon, XMarkIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import Main from '../../components/Layout/Main'
import Fuse from 'fuse.js'
import { env } from '../../env/client.mjs'
import { inferQueryOutput, trpc } from '../../utils/trpc'
import AddItemModal from '../../components/Modals/AddItemModal'
import ConfirmationModal from '../../components/Modals/ConfirmationModal'
import Link from 'next/link'
import { useQueryClient } from 'react-query'
import { useSession } from 'next-auth/react'
import { useLoading } from '../../components/Context/LoadingContext'
import { useAutoAnimate } from '@formkit/auto-animate/react'

export default function ItemsPage() {
  const [parent] = useAutoAnimate<HTMLDivElement>()
  const { setLoading } = useLoading()
  const session = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const collectionId = router.query.collection as string
  const itemsQuery = trpc.useQuery(['items.getAllForCollection', { collectionId }])
  const collectionQuery = trpc.useQuery(['collections.get', { collectionId }])
  const deleteItemMutation = trpc.useMutation('items.delete', {
    onSuccess: () => queryClient.invalidateQueries('items.getAllForCollection'),
  })
  const [fuse, setFuse] = useState<Fuse<inferQueryOutput<'items.getAllForCollection'>[number]>>()
  const [filteredItems, setFilteredItems] = useState<inferQueryOutput<'items.getAllForCollection'>>()
  const [addItemModalOpen, setAddItemModalOpen] = useState<boolean>(false)
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false)
  const [itemToDelete, setItemToDelete] = useState<{ name: string; id: string } | undefined>()
  const [canEdit, setCanEdit] = useState<boolean>(false)

  useEffect(() => {
    const show = (itemsQuery?.data?.length ?? 0) > 10
    setShowSearch(show)
    if (show) {
      const fuse = new Fuse(itemsQuery.data ?? [], { keys: ['name', 'locus.name'], threshold: 0.3, distance: 100 })
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
    setConfirmDeleteOpen(false)
    setItemToDelete(undefined)
    setFilteredItems(undefined)
    if (!confirmed) return
    deleteItemMutation.mutate({ itemId: id })
  }

  useEffect(() => {
    setCanEdit(session.data?.user?.id === collectionQuery.data?.owner.id)
  }, [session.data?.user?.id, collectionQuery.data?.owner.id])

  useEffect(() => {
    setLoading(itemsQuery.isLoading)
  }, [itemsQuery.isLoading, setLoading])

  return (
    <Main>
      <ConfirmationModal open={confirmDeleteOpen} onClose={handleConfirm} message={`Delete "${itemToDelete?.name}"?`} />
      {canEdit && (
        <AddItemModal open={addItemModalOpen} collectionId={collectionId} onClose={() => setAddItemModalOpen(false)} />
      )}
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
      <div className="mt-15">
        <div ref={parent}>
          {(filteredItems ?? itemsQuery.data)?.map((item) => (
            <div key={item.id}>
              <div className="flex flex-row">
                <Link href={`${env.NEXT_PUBLIC_BASE_URI}/items/${item.id}`}>
                  <div
                    className="whitespace-nowrap overflow-hidden pl-4 py-2 w-full 
                  cursor-pointer rounded-lg hover:bg-gradient-to-r 
                  hover:to-black hover:from-neutral-800 flex flex-col md:flex-row"
                  >
                    <div>{item.name}</div>
                    <div className="colorsnap font-thin md:items-center flex flex-col md:flex-row pl-0 md:pl-1 items-start">
                      <ChevronRightIcon className=" h-4 w-4 hidden md:block" />
                      <div className="sm:pl-1">{item.locus.name}</div>
                    </div>
                  </div>
                </Link>
                {canEdit && (
                  <div className="ml-3 mt-2">
                    <button
                      type="button"
                      className="inline-flex items-center p-1 rounded-full shadow-sm bg-black 
                    hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-1 
                    focus:ring-neutral-800"
                      onClick={() => handleDeleteItem(item.id, item.name)}
                    >
                      <XMarkIcon className="colorpop h-4 w-4" />
                    </button>
                  </div>
                )}
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
