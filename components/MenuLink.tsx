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
      <Link href={href} className='text-slate-800 font-semibold mr-2'>
        {description}
      </Link>
    </li>
  )
}
