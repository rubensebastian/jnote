import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  const { username, email, password } = await request.json()

  if (!username || !email || !password) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
  }

  try {
    const password_hash = await bcrypt.hash(password, 10)

    const applicant = await prisma.applicant.create({
      data: { username, email, password_hash },
    })

    return NextResponse.json(
      { message: 'User created', applicant },
      { status: 201 }
    )
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'Email or username already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
