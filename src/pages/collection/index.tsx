import { XMarkIcon } from '@heroicons/react/20/solid'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'
import { useLoading } from '../../components/Context/LoadingContext'
import Button from '../../components/Elements/Button'
import Main from '../../components/Layout/Main'
import AddCollectionModal from '../../components/Modals/AddCollectionModal'
import ConfirmationModal from '../../components/Modals/ConfirmationModal'
import { env } from '../../env/client.mjs'
import { trpc } from '../../utils/trpc'

export default function CollectionsPage() {
  const queryClient = useQueryClient()
  const [noCollections, setNoCollections] = useState<boolean>(false)
  const [collectionModalOpen, setCollectionModalOpen] = useState<boolean>(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false)
  const [collectionToDelete, setCollectionToDelete] = useState<{ name: string; id: string } | undefined>()
  const { setLoading } = useLoading()
  const session = useSession()
  const { isLoading, data } = trpc.useQuery(
    ['collections.getAllForUser', { userId: session.data?.user?.id as string }],
    { enabled: !!session.data?.user?.id }
  )
  const deleteItemMutation = trpc.useMutation('collections.delete', {
    onSuccess: () => queryClient.invalidateQueries(['collections.getAllForUser']),
  })

  const handleDeleteCollection = async (id: string, name: string) => {
    setCollectionToDelete({ id, name })
    setConfirmDeleteOpen(true)
  }

  const handleConfirm = (confirmed: boolean) => {
    const { id } = collectionToDelete as { id: string }
    setConfirmDeleteOpen(false)
    setCollectionToDelete(undefined)
    if (!confirmed) return
    setLoading(true)
    deleteItemMutation.mutateAsync({ collectionId: id }).then(() => setLoading(false))
  }

  useEffect(() => {
    const loggedIn = !!session?.data
    const hasNoCollections = !!data && data.length == 0
    setNoCollections(loggedIn && hasNoCollections)
  }, [session.data, data])

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading, setLoading])

  const NoCollectionsButton = () => {
    return (
      <div className="flex flex-col w-1/2 mx-auto items-center gap-5 justify-center h-full">
        <div>{"It looks like you don't have any collections"}</div>
        <Button onClick={() => setCollectionModalOpen(true)}>Add One</Button>
      </div>
    )
  }

  return (
    <Main>
      <ConfirmationModal
        open={confirmDeleteOpen}
        onClose={handleConfirm}
        message={`Delete "${collectionToDelete?.name}"?`}
      />
      {!isLoading && (
        <AddCollectionModal
          open={collectionModalOpen}
          onClose={() => setCollectionModalOpen(false)}
          userId={session.data?.user?.id as string}
        />
      )}
      {noCollections ? (
        <NoCollectionsButton />
      ) : (
        <div className="mt-5">
          {data?.map((c) => (
            <div key={c.id}>
              <div className="flex flex-row items-center">
                <Link href={`${env.NEXT_PUBLIC_BASE_URI}/collection/${c.id}`}>
                  <div
                    className="whitespace-nowrap overflow-hidden pl-4 py-2 w-full 
                  cursor-pointer hover:bg-gradient-to-r md:items-center gap-1
                  hover:to-black hover:from-neutral-900 flex flex-col md:flex-row text-sm md:text-base"
                  >
                    <p>{c.name}</p>
                  </div>
                </Link>

                <div className=" ml-3 mt-2">
                  <button
                    type="button"
                    className="inline-flex items-center p-1 rounded-full shadow-sm bg-black 
                    hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-1 
                    focus:ring-neutral-800"
                    onClick={() => handleDeleteCollection(c.id, c.name)}
                  >
                    <XMarkIcon className="colorpop h-4 w-4" />
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
      )}
    </Main>
  )
}
