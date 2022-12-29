import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { CollectionItem } from '../../pages/collection/[collection]'
import UpdateLocusModal from '../Modals/UpdateLocusModal'
import { hasAuthority } from '../security/authorization'
import { WhenAllowed } from '../security/WhenAllowed'
import { CheckoutMenu } from './CheckoutMenu'
import { DeleteItemButton } from './DeleteItemButton'
import { CheckedOutBadge, LocusBadge } from './LocusBadge'
import { useMenuOpen } from './MenuOpenContext'

interface Props {
  collectionId: string
  item: CollectionItem
  ownerId: string
}

export function CollectionListItem({ collectionId, item, ownerId }: Props) {
  const session = useSession()
  const { hasCheckoutMenuOpen, sethasCheckoutMenuOpen } = useMenuOpen()
  const [moveModalOpen, setMoveModalOpen] = useState(false)

  const handleClick = () => {
    if (!hasAuthority(session.data, 'collection', ownerId, 'write')) return
    if (hasCheckoutMenuOpen === item.id) sethasCheckoutMenuOpen(undefined)
    else sethasCheckoutMenuOpen(item.id)
  }

  const anotherItemMenuOpen = () => {
    if (hasCheckoutMenuOpen === undefined) return false
    if (hasCheckoutMenuOpen === item.id) return false
    return true
  }

  const handleLocusBadgeClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    setMoveModalOpen(true)
  }

  return (
    <div key={item.id} className={`${anotherItemMenuOpen() ? 'text-neutral-600' : ''}`}>
      <UpdateLocusModal
        ownerId={ownerId}
        collectionId={collectionId}
        itemId={item.id}
        currentLocus={item.locus}
        open={moveModalOpen}
        onClose={() => setMoveModalOpen(false)}
      />
      <div className={'flex flex-col w-full'}>
        <div className="flex flex-row items-center w-full">
          <div
            className="whitespace-nowrap overflow-hidden pl-4 py-2 w-full 
                       cursor-pointer hover:bg-gradient-to-r md:items-center gap-1
                     hover:to-black hover:from-neutral-900 flex flex-col md:flex-row text-sm md:text-base"
            onClick={handleClick}
          >
            <p>{item.name}</p>
            <div className="flex flex-row md:items-center">
              {item.amountCheckedOut > 0 && (
                <div className="pr-2">
                  <CheckedOutBadge amount={item.amountCheckedOut} />
                </div>
              )}
              <div onClick={handleLocusBadgeClick}>
                <LocusBadge name={item.locus.name} amount={item.amount} />
              </div>
            </div>
          </div>
          <DeleteItemButton item={item} ownerId={ownerId} />
        </div>
        <WhenAllowed resourceOwner={ownerId} resourceType="collection" actionType="write">
          <CheckoutMenu
            show={hasCheckoutMenuOpen === item.id}
            item={item}
            collectionId={collectionId}
            handleClose={() => sethasCheckoutMenuOpen(undefined)}
          />
        </WhenAllowed>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-neutral-800" />
        </div>
      </div>
    </div>
  )
}
