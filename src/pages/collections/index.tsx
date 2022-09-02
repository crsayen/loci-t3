import { PlusIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Main from '../../components/Layout/Main'
import NavList from '../../components/Lists/NavList'
import { env } from '../../env/client.mjs'
import { trpc } from '../../utils/trpc'

export default function CollectionsPage() {
  const { isLoading, data } = trpc.useQuery(['collection.getAll'])
  const router = useRouter()
  const [canEdit, setCanEdit] = useState<boolean>(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false)
  const [addLociModalOpen, setAddLociModalOpen] = useState<boolean>(false)
  const [lociToDelete, setLociToDelete] = useState<string>('')
  const [handleConfirm, setHandleConfirm] = useState<(result: boolean) => void>((_) => {
    console.log('still using old func')
  })

  const handleSelect = (item: string) => {
    // const listItem = listItems.filter((i) => i.text == item)[0]
    // router.push(listItem.path)
  }

  const handleDeleteItem = async (item: string) => {
    const onConfirmation = async (confirmed: boolean) => {
      if (confirmed) {
        // setLoading(true)
        // await httpDelete(`${BASE_URI}/api/${collectionsPath}/${encodeURIComponent(item)}`, getIdTokenClaims)
        // loadItems()
      } else {
        console.log('nevermind')
      }
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      setHandleConfirm((_: boolean) => {})
      setConfirmDeleteOpen(false)
    }
    setLociToDelete(item)
    setHandleConfirm(() => onConfirmation)
    setConfirmDeleteOpen(true)
  }

  if (isLoading || !data) return <>loading...</>

  return (
    <Main>
      {/* <ConfirmationModal open={confirmDeleteOpen} onClose={handleConfirm} message={`Delete "${lociToDelete}"?`} /> */}
      {/* <AddLociModal open={addLociModalOpen} onClose={() => setAddLociModalOpen(false)} /> */}
      <div className="-mt-1 absolute mx-auto py-2 z-10 flex flex-row items-end gap-5 justify-start bg-black w-full pr-auto">
        <div className="flex flex-row justify-start items-center gap-4">
          {/* {listItems.length > 10 && (
            <div className="w-60">
              <Search items={listItems.map((i) => i.text)} onSelect={handleSelect} />
            </div>
          )} */}

          <div>
            <button
              type="button"
              className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-white hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-neutral-500"
              onClick={() => setAddLociModalOpen(true)}
            >
              <PlusIcon className="h-3 w-3" stroke="#000000" />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <NavList
          items={data.map((c) => {
            return {
              text: c.name,
              path: `${env.NEXT_PUBLIC_BASE_URI}/collections/${c.id}`,
            }
          })}
          onDelete={canEdit ? handleDeleteItem : undefined}
        />
      </div>
    </Main>
  )
}
