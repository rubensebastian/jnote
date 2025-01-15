import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { job, jobDescriptions, jobEducations, jobResponsibilities } = data

    const newJob = await prisma.job.create({
      data: job,
    })

    for (const desc of jobDescriptions) {
      desc['job_id'] = newJob.id
    }
    await prisma.job_description.createMany({
      data: jobDescriptions,
    })

    for (const edu of jobEducations) {
      edu['job_id'] = newJob.id
    }
    await prisma.job_education.createMany({
      data: jobEducations,
    })

    for (const resp of jobResponsibilities) {
      resp['job_id'] = newJob.id
    }
    await prisma.job_responsibility.createMany({
      data: jobResponsibilities,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Unknown error occurred' },
      { status: 500 }
    )
  }
}
