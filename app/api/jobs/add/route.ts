import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { job, jobDetails } = data

    const newJob = await prisma.job.create({
      data: job,
    })

    // Split textarea values by line break to create individual entries
    const jobDescriptions = jobDetails.descriptions
      .split('\n')
      .filter((desc: string) => desc.trim() !== '')
      .map((desc: string, index: number) => ({
        job_id: newJob.id,
        description: desc.trim(),
        order: index,
      }))

    const jobEducations = [
      ...jobDetails.requiredEducation
        .split('\n')
        .filter((field: string) => field.trim() !== '')
        .map((field: string) => ({
          job_id: newJob.id,
          field: field.trim(),
          required: 'REQUIRED',
        })),
      ...jobDetails.preferredEducation
        .split('\n')
        .filter((field: string) => field.trim() !== '')
        .map((field: string) => ({
          job_id: newJob.id,
          field: field.trim(),
          required: 'PREFERRED',
        })),
    ]

    const jobResponsibilities = [
      ...jobDetails.requiredResponsibilities
        .split('\n')
        .filter((resp: string) => resp.trim() !== '')
        .map((resp: string) => ({
          job_id: newJob.id,
          description: resp.trim(),
          required: 'REQUIRED',
        })),
      ...jobDetails.preferredResponsibilities
        .split('\n')
        .filter((resp: string) => resp.trim() !== '')
        .map((resp: string) => ({
          job_id: newJob.id,
          description: resp.trim(),
          required: 'PREFERRED',
        })),
    ]

    if (jobDescriptions.length) {
      await prisma.job_description.createMany({ data: jobDescriptions })
    }
    if (jobEducations.length) {
      await prisma.job_education.createMany({ data: jobEducations })
    }
    if (jobResponsibilities.length) {
      await prisma.job_responsibility.createMany({ data: jobResponsibilities })
    }

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
