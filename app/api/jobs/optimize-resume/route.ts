import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { fetchGeneratedEmbeddings } from '@/lib/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { job, token, email } = data
    const userID = job.applicant_id

    const applicant = await prisma.applicant.findUnique({
      where: { id: Number(userID) },
    })
    if (!applicant) {
      return NextResponse.json(
        {
          success: false,
          error: "You don't seem to be logged in. Try doing that.",
        },
        { status: 500 }
      )
    }

    if (applicant.number_of_generates < 1) {
      return NextResponse.json(
        {
          success: false,
          error: "You don't have any free resume optimizations this month ):",
        },
        { status: 500 }
      )
    }

    const educations = await prisma.education.findMany({
      where: { applicant_id: Number(userID) },
    })
    const experiences = await prisma.experience.findMany({
      where: { applicant_id: Number(userID) },
      include: { responsibility: true },
    })

    if (!educations || !experiences) {
      return NextResponse.json(
        {
          success: false,
          error: "You don't have resume data. Try adding some.",
        },
        { status: 500 }
      )
    }

    const safeEducations = educations.map((edu) => ({
      ...edu,
      id: edu.id.toString(),
    }))

    const safeExperiences = experiences.map((exp) => ({
      ...exp,
      id: exp.id.toString(),
      responsibility: exp.responsibility.map((resp) => ({
        ...resp,
        id: resp.id.toString(),
        experience_id: resp.experience_id.toString(),
      })),
    }))

    const jobData = await fetchGeneratedEmbeddings(
      job.jobEducation,
      safeEducations,
      job.jobDescription,
      job.jobResponsibility,
      safeExperiences,
      token,
      email
    )

    await prisma.applicant.update({
      where: { id: Number(userID) },
      data: {
        number_of_generates: applicant.number_of_generates - 1,
      },
    })

    return NextResponse.json({
      success: true,
      weightedExperiences: jobData.weightedExperiences,
      weightedEducations: jobData.weightedEducations,
      message: `You have ${
        applicant.number_of_generates - 1
      } resume optimizations remaining this month`,
    })
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
