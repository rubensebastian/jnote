import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email, plan, paymentMethodId } = await req.json()

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

    // **Attach Payment Method if provided**
    if (paymentMethodId) {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: stripeCustomerId,
      })
      await stripe.customers.update(stripeCustomerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
      })
    }

    // Check if the customer has a payment method
    const customer = await stripe.customers.retrieve(stripeCustomerId)
    const defaultPaymentMethod = (customer as any).invoice_settings
      ?.default_payment_method

    if (!defaultPaymentMethod) {
      return NextResponse.json(
        { error: 'No payment method attached. Please add one.' },
        { status: 400 }
      )
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

    // Create the subscription with default payment method
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: priceId }],
      default_payment_method: defaultPaymentMethod,
      expand: ['latest_invoice.payment_intent'],
    })

    // Update database with subscription details
    await prisma.applicant.update({
      where: { email },
      data: {
        stripe_subscription_id: subscription.id,
        account_level: plan,
      },
    })

    return NextResponse.json({ subscriptionId: subscription.id })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
