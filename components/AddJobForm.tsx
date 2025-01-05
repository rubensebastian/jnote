'use client'

import { Prisma } from '@prisma/client'
import { JwtPayload } from 'jsonwebtoken'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type JobWithChildren = {
  applicant_id: number
  organization: string
  title: string
  applied_at: Date | null
  jobDescription: {
    description: string
    order: number
  }[]
  jobResponsibility: {
    description: string
    required: 'REQUIRED' | 'PREFERRED'
  }[]
  jobEducation: {
    field: string
    required: 'REQUIRED' | 'PREFERRED'
  }[]
}

export default function AddJobForm(user: JwtPayload) {
  const [job, setJob] = useState<JobWithChildren>({
    applicant_id: user.id,
    organization: '',
    title: '',
    applied_at: null,
    jobDescription: [
      {
        description: '',
        order: 1,
      },
      {
        description: '',
        order: 2,
      },
    ],
    jobResponsibility: [
      {
        description: '',
        required: 'REQUIRED',
      },
      {
        description: '',
        required: 'REQUIRED',
      },
    ],
    jobEducation: [
      {
        field: '',
        required: 'REQUIRED',
      },
    ],
  })
  return (
    <>
      <form></form>
    </>
  )
}
