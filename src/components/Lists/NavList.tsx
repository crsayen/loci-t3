import { XMarkIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

export interface NavListItem {
  text: string
  path: string
}

interface Props {
  items: Array<NavListItem>
  onDelete?: (itemName: string) => void
}

const NavListItem = (item: NavListItem, onDelete?: (itemName: string) => void) => (
  <div key={item.path}>
    <div className="flex flex-row">
      <Link href={`${item.path}`}>
        <div className="whitespace-nowrap overflow-hidden pl-4 py-2 w-full cursor-pointer rounded-lg hover:bg-gradient-to-r hover:to-black hover:from-neutral-800">
          {item.text}
        </div>
      </Link>
      {onDelete != undefined && (
        <div className="ml-3 mt-2">
          <button
            type="button"
            className="inline-flex items-center p-1 rounded-full shadow-sm bg-black hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-neutral-800"
            onClick={() => onDelete(item.text)}
          >
            <XMarkIcon className="h-4 w-4" />
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
)

export default function NavList(props: Props) {
  return <div>{props.items.map((item) => NavListItem(item, props.onDelete))}</div>
}
