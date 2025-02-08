import Link from 'next/link'

export default function Menu() {
  return (
    <nav>
      <ol className='flex flex-row items-center justify-end h-12 bg-green-500 mt-2 px-4'>
        <li>
          <Link href='/about'>About JobNote</Link>
        </li>
        <li>
          <Link href='/account'>Your Account</Link>
        </li>
      </ol>
    </nav>
  )
}
