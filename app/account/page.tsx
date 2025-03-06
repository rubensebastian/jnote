import ManageSubscription from '@/components/ManageSubscription'
import SubscribeForm from '@/components/SubscribeForm'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt, { JwtPayload } from 'jsonwebtoken'
import prisma from '@/lib/prisma'
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
    redirect('/login')
  } else {
    const applicant = await prisma.applicant.findUnique({
      where: { email: user.email },
    })
    if (applicant!.account_level == 'TESTER') {
      return (
        <main>
          <h1>Welcome, {applicant!.full_name}!</h1>
          <p>Thanks for helping with testing!</p>
          <br />
          <LogoutButton />
        </main>
      )
    }
    return (
      <main>
        <h1>Welcome, {applicant!.full_name}!</h1>
        {applicant!.stripe_subscription_id === null ? (
          <SubscribeForm email={user.email} />
        ) : (
          <ManageSubscription email={user.email} />
        )}
        <br />
        <LogoutButton />
      </main>
    )
  }
}
