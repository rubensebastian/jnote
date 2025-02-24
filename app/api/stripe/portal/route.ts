import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    // Fetch the customer from the database
    const user = await prisma.applicant.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Retrieve the Stripe customer ID from metadata
    const customer = await stripe.customers.list({ email })
    if (!customer.data.length) {
      return NextResponse.json(
        { error: 'Stripe customer not found' },
        { status: 404 }
      )
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.data[0].id,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/jobs`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch {
    return NextResponse.json(
      { error: 'Unable to create portal session' },
      { status: 500 }
    )
  }
}
