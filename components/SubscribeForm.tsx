'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export default function SubscribeForm({ email }: { email: string }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm email={email} />
    </Elements>
  )
}

function CheckoutForm({ email }: { email: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [plan, setPlan] = useState('PRO')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubscribe = async () => {
    if (!stripe || !elements) return

    setLoading(true)

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)!,
    })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, plan, paymentMethodId: paymentMethod.id }),
    })

    const data = await res.json()
    setLoading(false)

    if (data.subscriptionId) {
      router.push('/account')
    } else {
      alert(data.error || 'Failed to connect to Stripe')
    }
  }

  return (
    <div className='p-6 bg-slate-600 shadow-md rounded-lg'>
      <h2 className='text-lg font-semibold mb-4'>Subscribe to a Plan</h2>
      <select
        value={plan}
        onChange={(e) => setPlan(e.target.value)}
        className='border p-2 rounded w-full mb-3 text-black'
      >
        <option value='PRO'>Pro - $10/month</option>
        <option value='PREMIUM'>Premium - $25/month</option>
      </select>
      <div className='border p-2 rounded bg-white mb-3'>
        <CardElement />
      </div>
      <button
        onClick={handleSubscribe}
        className='bg-blue-500 text-white p-2 rounded w-full'
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Subscribe'}
      </button>
    </div>
  )
}
