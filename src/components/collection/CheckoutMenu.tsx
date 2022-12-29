import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid'
import { ChangeEvent, useState } from 'react'
import { useQueryClient } from 'react-query'
import { CollectionItem } from '../../pages/collection/[collection]'
import { trpc } from '../../utils/trpc'
import Button from '../Elements/Button'
import { inputStyle } from '../StyleProviders'
import { Spinner } from './Spinner'

interface Props {
  show: boolean
  item: CollectionItem
  collectionId: string
  handleClose: () => void
}

export function CheckoutMenu({ show, item, collectionId, handleClose }: Props) {
  const [numberCheckedOut, setNumberCheckedOut] = useState<number>(item.amountCheckedOut)
  const [inputValue, setInputValue] = useState<string>(item.amountCheckedOut.toString())
  const queryClient = useQueryClient()
  const {isLoading, data} = trpc.useQuery(['items.getAncestorLoci', {collectionId, locusName: item.locus.name }])
  const updateItemQuery = trpc.useMutation('items.update', {
    onSuccess: () => queryClient.invalidateQueries(['items.getAllForCollection']),
  })
  if (!show) return <></>

  const clampNumber = (n: number) => Math.min(Math.max(n, 0), item.amountCheckedOut + item.amount)

  const handleCheckoutString = (value: string) => {
    if (value === '' || isNaN(value as unknown as number)) {
      setInputValue('')
    } else {
      handleCheckout(parseInt(value))
    }
  }

  const handleCheckout = (n: number) => {
    const newNumberCheckedOut = clampNumber(n)
    setInputValue(newNumberCheckedOut.toString())
    setNumberCheckedOut(newNumberCheckedOut)
  }

  const handleSave = async () => {
    if (numberCheckedOut !== item.amountCheckedOut)
      await updateItemQuery.mutateAsync({
        itemId: item.id,
        data: {
          amount: item.amount + item.amountCheckedOut - numberCheckedOut,
          amountCheckedOut: numberCheckedOut,
        },
      })
    handleClose()
  }

  if (updateItemQuery.isLoading)
    return (
      <div className="flex items-center justify-center h-40 sm:h-16">
        <Spinner big />
      </div>
    )

  return (
    <div className="bg-black h-40 sm:h-16">
        <div className="flex flex-row sm:text-left pb-3 sm:pb-0 w-1/3 sm:pl-4 text-neutral-500">
          {data?.map((locusName) => (<div key={locusName}>{`${locusName}`}</div>) ?? [(<></>)])}  
        </div>
      <div className="flex flex-col sm:flex-row w-full py-2 gap-2 items-center">
        <div className="font-bold text-center sm:text-left pb-3 sm:pb-0 w-1/3 sm:pl-4">CHECKOUT</div>
        <div className="flex flex-row gap-2">
          <Button onClick={() => handleCheckout(0)}>MIN</Button>
          <Button onClick={() => handleCheckout(numberCheckedOut - 1)}>
            <MinusIcon className="text-white h-3 w-3" />
          </Button>
          <input
            type="numeric"
            name={`collection-name`}
            id={`collection-name`}
            value={inputValue}
            onBlur={() => setInputValue(numberCheckedOut.toString())}
            onChange={(event: ChangeEvent<HTMLInputElement>) => handleCheckoutString(event.target.value)}
            className={inputStyle(' w-20')}
          />
          <Button onClick={() => handleCheckout(numberCheckedOut + 1)}>
            <PlusIcon className="text-white h-3 w-3" />
          </Button>
          <Button onClick={() => handleCheckout(item.amountCheckedOut + item.amount)}>MAX</Button>
        </div>

        <div className="mx-auto sm:mx-0 sm:ml-auto pr-0 sm:pr-2">
          <Button color="good" onClick={handleSave}>
            SAVE
          </Button>
        </div>
      </div>
    </div>
  )
}
