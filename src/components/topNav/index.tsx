import { THeader } from './TopNav.types'
import Image from "next/image";

const TopNav = ({
    logo,
    title,
    pages
}: THeader) => {
  // Hooks
  // Variables
  // Functions
  // Effects

  return (
    <div className="border-b border-zinc-200 w-full flex items-center justify-between px-4 md:px-16 py-4 bg-white dark:bg-black dark:border-zinc-800">
      <div className="flex items-center space-x-4">
        <Image src={logo} alt={title} width={32} height={32} />
        <h1 className="text-xl font-bold text-gray-800 dark:text-white hidden md:block">{title}</h1>
      </div>
      
      <nav>
        <ul className="flex space-x-4">
          {pages?.map((page, index) => (
            <li key={index}>
              <a href={page.url} className="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400">
                {page.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
export default TopNav