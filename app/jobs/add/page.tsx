import jwt, { JwtPayload } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AddJobForm from '@/components/AddJobForm'

export default async function AddJob() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  const JWT_SECRET = process.env.JWT_SECRET

  let user: JwtPayload | null = null

  if (token && JWT_SECRET) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      if (
        typeof decoded === 'object' &&
        'id' in decoded &&
        'email' in decoded
      ) {
        user = decoded as JwtPayload
      }
    } catch (error) {
      redirect('/')
    }
  }

  if (!user) {
    redirect('/')
  } else {
    return (
      <main className='max-w-4xl mx-auto p-4'>
        <h1 className='text-center'>Add New Job</h1>
        <code>
          Don&apos;t want to deal with this? Use our extension/plugin instead
        </code>
        <AddJobForm user={user} />
      </main>
    )
  }
}
