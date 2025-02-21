'use client'

import { useState } from 'react'
import getStripe from '@/utils/get-stripejs'

export default function SubscribeForm({ email }: { email: string }) {
  const [plan, setPlan] = useState('PRO')

  const handleSubscribe = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, plan }),
    })

    const data = await res.json()

    if (data.sessionId) {
      const stripe = await getStripe()
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId })
      }
    } else {
      alert('Error creating checkout session')
    }
  }

  return (
    <div className='p-6 bg-white shadow-md rounded-lg'>
      <h2 className='text-lg font-semibold mb-4'>Subscribe to a Plan</h2>
      <select
        value={plan}
        onChange={(e) => setPlan(e.target.value)}
        className='border p-2 rounded w-full mb-3'
      >
        <option className='text-black' value='PRO'>
          Pro - $10/month
        </option>
        <option className='text-black' value='PREMIUM'>
          Premium - $25/month
        </option>
      </select>
      <button
        onClick={handleSubscribe}
        className='bg-blue-500 text-white p-2 rounded w-full'
      >
        Subscribe
      </button>
    </div>
  )
}
