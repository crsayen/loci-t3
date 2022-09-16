import { CollectionItem, CollectionOwner } from '../../pages/collection/[collection]'
import { CheckoutMenu } from './CheckoutMenu'
import { DeleteItemButton } from './DeleteItemButton'
import { CheckedOutBadge, LocusBadge } from './LocusBadge'
import { useMenuOpen } from './MenuOpenContext'

interface Props {
  item: CollectionItem
  owner: CollectionOwner
}

export function CollectionListItem({ item, owner }: Props) {
  const { hasCheckoutMenuOpen, sethasCheckoutMenuOpen } = useMenuOpen()

  const handleClick = () => {
    if (hasCheckoutMenuOpen === item.id) sethasCheckoutMenuOpen(undefined)
    else if (hasCheckoutMenuOpen) sethasCheckoutMenuOpen(undefined)
    else sethasCheckoutMenuOpen(item.id)
  }

  const anotherItemMenuOpen = () => {
    if (hasCheckoutMenuOpen === undefined) return false
    if (hasCheckoutMenuOpen === item.id) return false
    return true
  }

  return (
    <div key={item.id} className={`${anotherItemMenuOpen() ? 'blur-sm' : ''}`}>
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
              <LocusBadge name={item.locus.name} amount={item.amount} />
            </div>
          </div>
          <DeleteItemButton item={item} owner={owner} />
        </div>
        <CheckoutMenu
          show={hasCheckoutMenuOpen === item.id}
          item={item}
          handleClose={() => sethasCheckoutMenuOpen(undefined)}
        />
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-neutral-800" />
        </div>
      </div>
    </div>
  )
}
