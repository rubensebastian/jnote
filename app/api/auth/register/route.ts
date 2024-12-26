import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET

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
      { message: 'User created', applicant },
      { status: 201 }
    )
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })

    return response
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
