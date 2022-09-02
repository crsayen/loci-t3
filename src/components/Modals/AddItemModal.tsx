import { Dialog, Transition } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'
import { ChangeEvent, Fragment, useState } from 'react'
import { inputStyle } from './StyleProviders'

interface AddItemData {
  name: string
  count: number | ''
  description: string
  descriptionOpen: boolean
}

type Props = {
  open: boolean
  onClose: () => void
}

const newItem = (): AddItemData => {
  return { name: '', count: 1, description: '', descriptionOpen: false }
}

export default function AddItemModal(props: Props) {
  const router = useRouter()
  const [locus, setLocus] = useState<string>('')
  const [items, setItems] = useState<Array<AddItemData>>([newItem()])

  const handleEditItem = (i: number, property: keyof AddItemData, value: string) => {
    const oldItem = items[i]

    const newCount: number | '' = value == '' || isNaN(value as unknown as number) ? '' : parseInt(value)

    const newItem =
      property == 'count'
        ? { ...oldItem, count: newCount }
        : property == 'description'
        ? { ...oldItem, description: value }
        : { ...oldItem, name: value }

    setItems([...items.slice(0, i), newItem, ...items.slice(i + 1)])
  }

  const handleAddItem = () => setItems([...items, newItem()])

  const handleDeleteItem = (i: number) => setItems([...items.slice(0, i), ...items.slice(i + 1)])

  const handleDescriptionOpenChanged = (i: number) => {
    const oldItem = items[i]
    setItems([...items.slice(0, i), { ...oldItem, descriptionOpen: !oldItem.descriptionOpen }, ...items.slice(i + 1)])
  }

  const handleSave = async () => {
    const loci: Array<Item> = items
      .filter((i) => i.name)
      .map((i) => {
        return {
          name: i.name,
          locations: [{ count: i.count == '' ? 1 : i.count, locus } as Locus],
          description: i.description,
        }
      })

    const path = `${['users', router.query.user, 'collections', router.query.loci, 'items']
      //@ts-ignore
      .map(encodeURIComponent)
      .join('/')}`
    await post<Array<Item>, any>(`${BASE_URI}/api/${path}`, loci, getIdTokenClaims)
    props.onClose()
  }
  console.log(inputStyle('1/2'))

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={props.onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
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
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-black rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-6">
                <div>
                  <label htmlFor="locus" className="block text-sm font-medium text-white">
                    Locus
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="locus"
                      id="locus"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setLocus(event.target.value)}
                      className={inputStyle()}
                      placeholder="Where?"
                    />
                  </div>
                </div>
                <div>
                  {items.map((item, i) => {
                    return (
                      <div key={i}>
                        <div className="flex flex-row gap-3 pt-3">
                          <div>
                            <label htmlFor={`item-${i}`} className="block text-sm font-medium text-white">
                              Name
                            </label>
                            <div>
                              <input
                                type="text"
                                name={`item-${i}`}
                                id={`item-${i}`}
                                value={item.name}
                                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                  handleEditItem(i, 'name', event.target.value)
                                }
                                className={inputStyle(' w-56')}
                                placeholder="What?"
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor={`item-count-${i}`} className="block text-sm font-medium text-white">
                              Count
                            </label>
                            <div>
                              <input
                                type="text"
                                name={`item-count-${i}`}
                                id={`item-count-${i}`}
                                value={item.count}
                                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                  handleEditItem(i, 'count', event.target.value)
                                }
                                className={inputStyle()}
                              />
                            </div>
                          </div>
                          <div className="mt-5 sm:mt-6">
                            <button
                              type="button"
                              className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-neutral-600 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
                              onClick={() => handleDeleteItem(i)}
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="relative"></div>
                          {items[i].descriptionOpen && (
                            <div>
                              <label htmlFor={`item-description-${i}`} className="block text-sm font-medium text-white">
                                Description
                              </label>
                              <div>
                                <input
                                  type="text"
                                  name={`item-description-${i}`}
                                  id={`item-description-${i}`}
                                  value={item.description}
                                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                    handleEditItem(i, 'description', event.target.value)
                                  }
                                  className={inputStyle()}
                                  placeholder="What?!?"
                                />
                              </div>
                            </div>
                          )}
                          <div className="relative my-3" onClick={() => handleDescriptionOpenChanged(i)}>
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                              <div className="w-full border-t border-neutral-500" />
                            </div>
                            <div className="relative flex justify-center">
                              <span className="bg-black px-2 text-neutal-700">
                                {items[i].descriptionOpen ? (
                                  <ChevronUpIcon className="mx-auto h-6 w-6" />
                                ) : (
                                  <ChevronDownIcon className="mx-auto h-6 w-6" />
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-neutral-600 text-base font-medium text-white hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 sm:text-sm"
                    onClick={handleAddItem}
                  >
                    Add Item
                  </button>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                    onClick={handleSave}
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
