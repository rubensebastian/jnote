import Link from 'next/link'

export default function Menu() {
  return (
    <nav>
      <ol className='flex flex-row items-center justify-end h-12 bg-green-500 mt-2 px-4'>
        <li>Link 1</li>
        <li>Link 2</li>
      </ol>
    </nav>
  )
}
