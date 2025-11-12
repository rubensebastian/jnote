import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt, { JwtPayload } from 'jsonwebtoken'
import ResumeEditable from '@/components/ResumeEditable'

export default async function ResumeEdit() {
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
    const educations = await prisma.education.findMany({
      where: { applicant_id: user.id },
    })
    const experiences = await prisma.experience.findMany({
      where: { applicant_id: user.id },
      include: { responsibility: true },
    })

    return (
      <main className='py-4'>
        <h1 className='text-center'>Resume</h1>
        <ResumeEditable
          educations={educations}
          experiences={experiences}
          user={user}
        />
      </main>
    )
  }
}
