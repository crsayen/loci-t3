import { XMarkIcon } from '@heroicons/react/20/solid'
import { inferQueryOutput } from '../../utils/trpc'
import { WhenAllowed } from '../security/WhenAllowed'
import { CheckedOutBadge, LocusBadge } from './LocusBadge'

type ItemsQueryOutput = inferQueryOutput<'items.getAllForCollection'>
type CollectionQueryOutput = inferQueryOutput<'collections.get'>

type Item = ItemsQueryOutput[number]
type Owner = CollectionQueryOutput['owner']

interface Props {
  item: Item
  owner?: Owner
  handleDelete: (itemId: string, itemName: string) => void
}

export function CollectionListItem({ item, owner, handleDelete }: Props) {
  return (
    <div key={item.id}>
      <div className="flex flex-column">
        <div className="flex flex-row items-center">
          <div
            className="whitespace-nowrap overflow-hidden pl-4 py-2 w-full 
                       cursor-pointer hover:bg-gradient-to-r md:items-center gap-1
                     hover:to-black hover:from-neutral-900 flex flex-col md:flex-row text-sm md:text-base"
            onClick={() => undefined}
          >
            <p>{item.name}</p>
            <div className="flex flex-row md:items-center">
              {item.amountCheckedOut > 0 && (
                <div className="pr-2">
                  <CheckedOutBadge amount={item.amount - 1} />
                </div>
              )}
              <LocusBadge name={item.locus.name} amount={item.amount} />
            </div>
          </div>
          <WhenAllowed resourceOwner={owner?.id} resourceType="collection" actionType="write">
            <div className=" ml-3 mt-2">
              <button
                type="button"
                className="inline-flex items-center p-1 rounded-full shadow-sm bg-black 
                        hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-1 
                        focus:ring-neutral-800"
                onClick={() => handleDelete(item.id, item.name)}
              >
                <XMarkIcon className="colorpop h-4 w-4" />
              </button>
            </div>
          </WhenAllowed>
        </div>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-neutral-800" />
        </div>
      </div>
    </div>
  )
}
