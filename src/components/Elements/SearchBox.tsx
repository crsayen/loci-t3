import { Combobox } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import { ChangeEvent, useState } from 'react'
import { inputStyle } from '../StyleProviders'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Search(props: { items: Array<string>; onSelect: (selection: string) => void }) {
  const [query, setQuery] = useState('')

  const filteredPeople =
    query === ''
      ? []
      : props.items.filter((item) => {
          return item.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <Combobox as="div" value={''} onChange={(item: string) => props.onSelect(item)}>
      <div className="relative">
        <Combobox.Input
          className={inputStyle()}
          placeholder="Search"
          onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
          displayValue={(item: string) => item as string}
        />

        {filteredPeople.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-neutral-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredPeople.map((item) => (
              <Combobox.Option
                key={item}
                value={item}
                className={({ active }) =>
                  classNames('relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-neutral-700 ' : '')
                }
              >
                {({ active, selected }) => (
                  <>
                    <span className={classNames('block truncate', selected ? 'font-semibold' : '')}>{item}</span>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? '' : 'text-indigo-600'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )
}
