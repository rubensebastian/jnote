import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
  }

  try {
    const applicant = await prisma.applicant.findUnique({
      where: { email },
    })

    if (!applicant) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isValid = await bcrypt.compare(password, applicant.password_hash)

    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    if (!JWT_SECRET) {
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      )
    }

    const token = jwt.sign(
      { id: applicant.id, email: applicant.email },
      JWT_SECRET,
      {
        expiresIn: '30d',
      }
    )

    const response = NextResponse.json(
      { message: 'Login successful', token },
      { status: 200 }
    )
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
