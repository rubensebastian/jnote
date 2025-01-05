import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const { jobToDelete } = data
    await prisma.job.delete({
      where: { id: BigInt(jobToDelete) },
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
