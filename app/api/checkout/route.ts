import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email, plan } = await req.json()

    if (!['PRO', 'PREMIUM'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      )
    }

    // Fetch user from the database
    const user = await prisma.applicant.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create or retrieve Stripe Customer
    let stripeCustomerId = user.stripe_customer_id
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({ email })
      stripeCustomerId = customer.id
      await prisma.applicant.update({
        where: { email },
        data: { stripe_customer_id: stripeCustomerId },
      })
    }

    // Get the correct price ID
    const priceId =
      plan === 'PRO'
        ? process.env.STRIPE_PRO_PLAN_PRICE_ID
        : process.env.STRIPE_PREMIUM_PLAN_PRICE_ID

    if (!priceId) {
      return NextResponse.json(
        { error: 'Missing Stripe price ID' },
        { status: 400 }
      )
    }

    // Create a new subscription
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    })

    // Update user with subscription ID and plan
    await prisma.applicant.update({
      where: { email },
      data: {
        stripe_subscription_id: subscription.id,
        account_level: plan,
      },
    })

    return NextResponse.json({ sessionId: subscription.id })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
