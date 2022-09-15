import { Dialog, Transition } from '@headlessui/react'
import { ChangeEvent, Fragment, useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'
import { trpc } from '../../utils/trpc'
import { useLoading } from '../Context/LoadingContext'
import { inputStyle } from '../StyleProviders'

type Props = {
  userId: string
  open: boolean
  onClose: () => void
}

export default function AddCollectionModal({ userId, open, onClose }: Props) {
  const { setLoading } = useLoading()
  const queryClient = useQueryClient()
  const addCollectionMutation = trpc.useMutation('users.addCollection', {
    onSuccess: () => queryClient.invalidateQueries(['collections.getAllForUser']),
  })
  const [collectionName, setCollectionName] = useState<string>()

  const handleSave = async () => {
    if (!collectionName) return
    addCollectionMutation.mutate({
      collectionName,
      userId,
    })
    onClose()
  }

  useEffect(() => {
    setLoading(addCollectionMutation.isLoading)
  }, [addCollectionMutation.isLoading, setLoading])

  return (
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
              <Dialog.Panel className="relative bg-black rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-6">
                <div>
                  <label htmlFor="collection-name" className="block text-sm font-medium text-white">
                    New Collection
                  </label>
                  <input
                    type="text"
                    name={`collection-name`}
                    id={`collection-name`}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setCollectionName(event.target.value)}
                    className={inputStyle(' w-56')}
                    placeholder="What will you call it?"
                  />
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                    onClick={collectionName ? handleSave : undefined}
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
  )
}
