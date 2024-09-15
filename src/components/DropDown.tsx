import { useState } from 'react'
import { account } from './Landing';

const DropDown = ({ title, accounts, setFn }: { title: string, accounts: account[], setFn: any }) => {
  const [toggle, setToggle] = useState(false);
  let num = 1;
  return (

    <>
      <button onClick={() => { setToggle((toggle) => !toggle) }} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">{title} <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
      </svg>
      </button>

      <div id="dropdownHover" className={`z-10 ${toggle ? "block" : "hidden"} bg-white mt-3 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
          {accounts.map((acc) => { return <Item key={num} onClick={() => { setFn(acc.seed) }} title={`Account ${num++}`} /> })}
        </ul>
      </div>
    </>
  )
}

export default DropDown

const Item = ({ title, onClick }: { title: string, onClick: any }) => {
  return <li>
    <button onClick={onClick} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{title}</button>
  </li>
}
