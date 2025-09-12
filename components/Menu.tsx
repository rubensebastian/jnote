import MenuLink from './MenuLink'

export default function Menu() {
  return (
    <nav>
      <ol className='flex flex-row items-center justify-end h-12 bg-gray-300 px-4'>
        <MenuLink href='/upgrade' description='Upgrade to Pro' />
        <MenuLink href='/jobs' description='Jobs' />
        <MenuLink href='/resume' description='Résumé' />
        <MenuLink href='/about' description='About JobNote' />
        <MenuLink href='/account' description='Your Account' />
      </ol>
    </nav>
  )
}
