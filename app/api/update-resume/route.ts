import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const data = await req.json()

    const { educations, experiences } = data

    for (const edu of educations) {
      console.log('Updating education:', edu)
      await prisma.education.update({
        where: { id: BigInt(edu.id) }, // Ensure id is BigInt
        data: {
          institution: edu.institution,
          field: edu.field,
          level: edu.level,
          start_date: new Date(edu.start_date),
          end_date: edu.end_date ? new Date(edu.end_date) : null,
        },
      })
    }

    for (const exp of experiences) {
      console.log('Updating experience:', exp)

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
        console.log('Updating responsibility:', resp)

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
