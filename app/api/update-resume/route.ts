import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const data = await req.json()

    const {
      educations,
      createEducations,
      deleteEducations,
      deleteResponsibilities,
      experiences,
      createExperiences,
      deleteExperiences,
    } = data

    //separate edited, deleted, and newly created
    //edited should update
    //new should add with auto ids
    //handle createExperiences, which don't have IDs
    //handle resp. of createExperiences, which need to be linked to corresponding createExperiences

    for (const edu of educations) {
      await prisma.education.update({
        where: { id: BigInt(edu.id) },
        data: {
          institution: edu.institution,
          field: edu.field,
          level: edu.level,
          start_date: new Date(edu.start_date),
          end_date: edu.end_date ? new Date(edu.end_date) : null,
        },
      })
    }

    for (const edu of deleteEducations) {
      await prisma.education.delete({
        where: { id: BigInt(edu.id) },
      })
    }

    for (const edu of createEducations) {
      const isoStartDate = new Date(edu.start_date)
      const isoEndDate = edu.end_date ? new Date(edu.end_date) : null
      edu['start_date'] = isoStartDate
      edu['end_date'] = isoEndDate
    }

    await prisma.education.createMany({
      data: createEducations,
    })

    for (const exp of experiences) {
      await prisma.experience.update({
        where: { id: BigInt(exp.id) },
        data: {
          title: exp.title,
          organization: exp.organization,
          start_date: new Date(exp.start_date),
          end_date: exp.end_date ? new Date(exp.end_date) : null,
        },
      })

      for (const resp of exp.responsibility) {
        await prisma.responsibility.upsert({
          where: { id: BigInt(resp.id) },
          update: {
            description: resp.description,
          },
          create: {
            description: resp.description,
            experience_id: BigInt(exp.id),
          },
        })
      }
    }

    for (const resp of deleteResponsibilities) {
      await prisma.responsibility.delete({
        where: { id: BigInt(resp.id) },
      })
    }

    for (const exp of deleteExperiences) {
      await prisma.experience.delete({
        where: { id: BigInt(exp.id) },
      })
    }

    for (const exp of createExperiences) {
      const isoStartDate = new Date(exp.start_date)
      const isoEndDate = exp.end_date ? new Date(exp.end_date) : null
      exp['start_date'] = isoStartDate
      exp['end_date'] = isoEndDate

      const experience = await prisma.experience.create({
        data: {
          applicant_id: exp.applicant_id,
          start_date: exp.start_date,
          end_date: exp.end_date ?? null,
          organization: exp.organization,
          title: exp.title,
        },
      })

      const responsibilities = [...exp.responsibility]
      for (const resp of responsibilities) {
        resp['experience_id'] = experience.id
      }

      await prisma.responsibility.createMany({
        data: responsibilities,
      })
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
