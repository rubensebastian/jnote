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
  }

  return (
    <main
      id='main-page'
      className='h-screen flex flex-col items-center justify-center'
    >
      <h1 className='text-5xl font-semibold'>JobNote</h1>
      <div className='my-6'>
        <Link
          href={'/login'}
          className='bg-green-500 text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 mx-2'
        >
          Login →
        </Link>
        <Link
          href={'/register'}
          className='bg-purple-500 text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-purple-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 mx-2'
        >
          Register for free →
        </Link>
      </div>
      <div className='bg-slate-800 py-2 px-6 border-white border-2 rounded max-w-96'>
        <h2 className='text-xl text-center'>How it Works</h2>
        <ol>
          <li className='list-decimal'>
            Add your <em>whole</em> resume—every single thing you&apos;ve ever
            done in every job.
          </li>
          <li className='list-decimal'>Add a job you want to apply for.</li>
          <li className='list-decimal'>
            Get a natural-language optimized resume for <em>that</em> job.
          </li>
        </ol>
        <p className='text-center'>Just 3 steps. It&apos;s that easy.</p>
      </div>
    </main>
  )
}
