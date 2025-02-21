import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PrismaClient, Plan } from '@prisma/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature') as string
  let event: Stripe.Event

  try {
    const body = await req.text()
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook Error:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  const session = event.data.object as Stripe.Subscription

  if (
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated'
  ) {
    // Get customer email
    const customer = await stripe.customers.retrieve(session.customer as string)
    const email = (customer as Stripe.Customer).email

    if (!email) {
      return NextResponse.json(
        { error: 'No email found for customer' },
        { status: 400 }
      )
    }

    // Get the plan from the subscription
    const priceId = session.items.data[0].price.id
    let newPlan: Plan
    if (priceId === process.env.STRIPE_PRO_PLAN_PRICE_ID) {
      newPlan = 'PRO'
    } else if (priceId === process.env.STRIPE_PREMIUM_PLAN_PRICE_ID) {
      newPlan = 'PREMIUM'
    } else {
      newPlan = 'STANDARD'
    }

    // Update the user in the database
    await prisma.applicant.update({
      where: { email },
      data: {
        account_level: newPlan,
        stripe_subscription_id: session.id,
      },
    })
  }

  if (event.type === 'customer.subscription.deleted') {
    // Customer canceled their subscription, downgrade to STANDARD
    const customer = await stripe.customers.retrieve(session.customer as string)
    const email = (customer as Stripe.Customer).email

    if (email) {
      await prisma.applicant.update({
        where: { email },
        data: { account_level: 'STANDARD', stripe_subscription_id: null },
      })
    }
  }

  return NextResponse.json({ received: true })
}
