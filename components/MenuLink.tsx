import Link from 'next/link'

export default function MenuLink({
  href,
  description,
}: {
  href: string
  description: string
}) {
  return (
    <li>
      <Link href={href} className='text-white font-semibold text-lg ml-4'>
        {description}
      </Link>
    </li>
  )
}
