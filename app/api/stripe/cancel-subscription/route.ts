import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const user = await prisma.applicant.findUnique({ where: { email } })

    if (!user || !user.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      )
    }

    // Cancel subscription at the end of billing period
    await stripe.subscriptions.update(user.stripe_subscription_id, {
      cancel_at_period_end: true,
    })

    return NextResponse.json({
      message: 'Subscription will be canceled at the end of the billing period',
    })
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return NextResponse.json(
      { error: 'Unable to cancel subscription' },
      { status: 500 }
    )
  }
}
