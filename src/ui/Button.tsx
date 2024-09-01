import React from 'react'

const Button = ({ title, onclick }: { title: string, onclick: (e: React.MouseEvent<HTMLButtonElement>) => void }) => {
  return (
    <button onClick={onclick} className=' text-black rounded-md px-5 py-2 bg-white '>{title}</button>
  )
}

export default Button
