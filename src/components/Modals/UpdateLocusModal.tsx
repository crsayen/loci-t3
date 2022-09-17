import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { useQueryClient } from 'react-query'
import { trpc } from '../../utils/trpc'
import SearchBox from '../Elements/SearchBox'
import { WhenAllowed } from '../security/WhenAllowed'

type Props = {
  ownerId: string
  collectionId: string
  itemId: string
  currentLocus: { name: string; id: string }
  open: boolean
  onClose: () => void
}

export default function UpdateLocusModal({ ownerId, collectionId, itemId, currentLocus, open, onClose }: Props) {
  const queryClient = useQueryClient()
  const lociQuery = trpc.useQuery(['loci.getAllForCollection', { collectionId }])
  const moveItemMutation = trpc.useMutation('items.move', {
    onSuccess: () => queryClient.invalidateQueries(['items.getAllForCollection']),
  })
  const createLocusMutation = trpc.useMutation('loci.create', {
    onSuccess: () => queryClient.invalidateQueries(['items.getAllForCollection']),
  })
  const [locus, setLocus] = useState<{ name: string; id?: string }>(currentLocus)

  const handleSave = async () => {
    const { name, id } = locus as { name: string; id: string | undefined }
    if (!id) {
      createLocusMutation
        .mutateAsync({
          name,
          collectionId,
          items: [],
        })
        .then((result) => moveItemMutation.mutate({ locusId: result.id, itemId }))
    } else {
      await moveItemMutation.mutate({ locusId: id, itemId })
    }
    onClose()
  }

  return (
    <WhenAllowed resourceOwner={ownerId} resourceType="collection" actionType="write">
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-50"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-neutral-900 bg-opacity-75 backdrop-blur-md transition-opacity" />
          </Transition.Child>

          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-50"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative bg-black rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-6">
                  <div>
                    <label htmlFor="locus" className="block text-sm font-medium text-white">
                      Locus
                    </label>
                    <SearchBox
                      items={lociQuery?.data?.map((i) => ({ name: i.name, id: i.id })) ?? []}
                      onSelect={setLocus}
                      onTextChange={(name) => setLocus({ name })}
                      placeholder={currentLocus.name}
                    />
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                      onClick={locus ? handleSave : undefined}
                    >
                      Save
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </WhenAllowed>
  )
}
