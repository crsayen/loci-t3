import React from 'react'

type Props = {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  children?: React.ReactNode
  disabled?: boolean
}

const Button = (props: Props) => {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className="inline-flex items-center justify-center px-3 py-2 
              border border-neutral-600 shadow-sm font-medium rounded-md
              bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-neutral-500 sm:mt-0 sm:ml-3 sm:w-auto 
              md:text-s text-xs disabled:text-neutral-700 disabled:hover:bg-neutral-900"
    >
      {props.children}
    </button>
  )
}

export default Button
