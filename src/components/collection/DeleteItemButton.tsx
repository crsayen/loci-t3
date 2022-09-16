import { XMarkIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import { useQueryClient } from 'react-query'
import { CollectionItem, CollectionOwner } from '../../pages/collection/[collection]'
import { trpc } from '../../utils/trpc'
import Button from '../Elements/Button'
import { WhenAllowed } from '../security/WhenAllowed'
import { Spinner } from './Spinner'

interface Props {
  item: CollectionItem
  owner: CollectionOwner
}

export function DeleteItemButton({ item, owner }: Props) {
  const queryClient = useQueryClient()
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const deleteItemMutation = trpc.useMutation('items.delete', {
    onSuccess: () => queryClient.invalidateQueries(['items.getAllForCollection']),
  })

  const handleDelete = () => {
    if (confirmDelete) {
      deleteItemMutation.mutate({ itemId: item.id })
      setConfirmDelete(false)
    } else setConfirmDelete(true)
  }

  if (deleteItemMutation.isLoading) return <Spinner />

  return (
    <WhenAllowed resourceOwner={owner?.id} resourceType="collection" actionType="write">
      <div className="ml-3 mt-2">
        {confirmDelete ? (
          <div className="flex flex-row gap-2">
            <div className="w-max">Are you sure?</div>
            <Button small color="good" onClick={handleDelete}>
              YES
            </Button>
            <Button small color="warn" onClick={() => setConfirmDelete(false)}>
              CANCEL
            </Button>
          </div>
        ) : (
          <button
            type="button"
            className="inline-flex items-center p-1 rounded-full shadow-sm bg-black 
            hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-1 
            focus:ring-neutral-800 text-neutral-600 hover:text-white"
            onClick={handleDelete}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </WhenAllowed>
  )
}
