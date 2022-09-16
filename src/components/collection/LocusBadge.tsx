import { ReactNode } from 'react'

function BadgeContent({ name, amount, children }: { name: string; amount: number; children: ReactNode }) {
  if (!amount) return <></>
  return (
    <>
      <div className="px-2 md:rounded-l-md rounded-l-sm">{name}</div>
      <>{children}</>
    </>
  )
}

export function LocusBadge({ name, amount }: { name: string; amount: number }) {
  return (
    <span className="rounded-md text-neutral-500 bg-neutral-900 flex flex-row w-min text-xs md:text-sm">
      {amount ? (
        <>
          <div className="px-2 md:rounded-l-md rounded-l-sm">{name}</div>
          <div className="px-2 rounded-r-md text-neutral-900 bg-neutral-500">{amount}</div>
        </>
      ) : (
        <>
          <div className="line-through px-2 md:rounded-l-md rounded-sm">{name}</div>
        </>
      )}
    </span>
  )
}

export function CheckedOutBadge({ amount }: { amount: number }) {
  return (
    <span className="rounded-md bg-red-400 text-neutral-800 flex flex-row w-min text-xs md:text-sm">
      <BadgeContent amount={amount} name="checked out">
        <div className="px-2 rounded-r-md text-red-400 bg-neutral-800">{amount}</div>
      </BadgeContent>
    </span>
  )
}
