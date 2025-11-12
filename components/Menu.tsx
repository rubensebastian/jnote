import MenuLink from './MenuLink'
import logo from '@/public/JobNote.svg'
import Image from 'next/image'
import Link from 'next/link'

export default function Menu() {
  return (
    <nav
      aria-label='Main Navigation'
      className='flex flex-row items-center my-4'
    >
      <Link href='/' className='flex-grow'>
        <Image src={logo} width={250} height={50} alt='Return to home' />
      </Link>
      <ol className='flex flex-row items-center justify-center'>
        <MenuLink href='/upgrade' description='Upgrade to Pro' />
        <MenuLink href='/jobs' description='Jobs' />
        <MenuLink href='/resume' description='Résumé' />
        <MenuLink href='/about' description='About JobNote' />
        <MenuLink href='/account' description='Your Account' />
      </ol>
    </nav>
  )
}
