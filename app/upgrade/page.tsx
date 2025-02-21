import SubscribeForm from '@/components/SubscribeForm'
import ManageSubscription from '@/components/ManageSubscription'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt, { JwtPayload } from 'jsonwebtoken'
import prisma from '@/lib/prisma'

export default async function Upgrade() {
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
    const applicant = await prisma.applicant.findUnique({
      where: { email: user.email },
    })
    return (
      <main>
        <h1>Upgrade your account</h1>
        {applicant!.stripe_subscription_id === null ? (
          <SubscribeForm />
        ) : (
          <ManageSubscription email={user.email} />
        )}
      </main>
    )
  }
}
