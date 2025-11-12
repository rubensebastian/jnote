import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt, { JwtPayload } from 'jsonwebtoken'
import JobList from '@/components/JobList'
import Link from 'next/link'

export default async function Jobs() {
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
    const jobs = await prisma.job.findMany({
      where: { applicant_id: user.id },
      include: {
        jobDescription: true,
        jobEducation: true,
        jobResponsibility: true,
      },
    })

    const applicant = await prisma.applicant.findUnique({
      where: { id: user.id },
    })

    if (!applicant) {
      redirect('/')
    }

    return (
      <main className='mx-auto py-4 px-10 grow'>
        <div className='flex flex-row items-center justify-center'>
          <h1>Saved Jobs</h1>
          <Link href={'/resume'} className='bg-highlight rounded-sm px-2 ml-6'>
            Go to Resume
          </Link>
        </div>
        <JobList
          initialJobs={jobs}
          numberOfGenerates={applicant.number_of_generates}
          fullName={applicant.full_name}
          token={token!}
          email={applicant.email}
          accountLevel={applicant.account_level}
        />
        <Link href='/jobs/add' className='underline'>
          Add a New Job →
        </Link>
      </main>
    )
  }
}
