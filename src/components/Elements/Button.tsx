import React from 'react'

type Color = 'warn' | 'good' | 'normal'

type Props = {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  children?: React.ReactNode
  disabled?: boolean
  small?: boolean
  color?: Color
}

function getColorClassnames(color: Color) {
  if (color === 'normal')
    return 'bg-neutral-900 hover:bg-neutral-800 border-neutral-600 focus:ring-neutral-500 disabled:text-neutral-700 disabled:hover:bg-neutral-900'
  if (color === 'warn')
    return 'bg-red-900 hover:bg-red-800 border-red-600 focus:ring-red-500 disabled:text-red-700 disabled:hover:bg-red-900'
  if (color === 'good')
    return 'bg-green-900 hover:bg-green-800 border-green-600 focus:ring-green-500 disabled:text-green-700 disabled:hover:bg-green-900'
}

const Button = (props: Props) => {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={`inline-flex items-center justify-center border shadow-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        props.small ? 'px-2 py-1 text-xxs md:text-xs' : 'px-3 py-2 text-xs md:text-s'
      } ${getColorClassnames(props.color ?? 'normal')}`}
    >
      {props.children}
    </button>
  )
}

export default Button
