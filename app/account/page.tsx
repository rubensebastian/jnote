import ManageSubscription from '@/components/ManageSubscription'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt, { JwtPayload } from 'jsonwebtoken'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

export default async function Account() {
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
    } catch {
      redirect('/')
    }
  }

  if (!user) {
    redirect('/')
  } else {
    return (
      <div>
        <ManageSubscription email={user.email} />
      </div>
    )
  }
}
