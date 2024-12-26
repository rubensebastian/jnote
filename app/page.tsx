import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt from 'jsonwebtoken'
import Link from 'next/link'

export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  const JWT_SECRET = process.env.JWT_SECRET

  let user = null

  if (token && JWT_SECRET) {
    try {
      user = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      console.error('Invalid token:', error)
    }
  }

  if (user) {
    redirect('/jobs')
  } else {
    return (
      <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
        <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
          <p>Future home page design to be made</p>
          <Link href={'/login'}>Login</Link>
          <Link href={'/register'}>Register</Link>
        </main>
      </div>
    )
  }
}
