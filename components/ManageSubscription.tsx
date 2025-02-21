'use client'

import { useState } from 'react'

export default function ManageSubscription({ email }: { email: string }) {
  const [loading, setLoading] = useState(false)

  const handlePortalRedirect = async () => {
    setLoading(true)
    const res = await fetch('/api/stripe/portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      alert('Error redirecting to billing portal')
    }
    setLoading(false)
  }

  const handleCancelSubscription = async () => {
    setLoading(true)
    const res = await fetch('/api/stripe/cancel-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    if (data.message) {
      alert('Subscription cancellation requested.')
    } else {
      alert('Error canceling subscription')
    }
    setLoading(false)
  }

  return (
    <div className='p-4 bg-white shadow-md rounded-lg'>
      <h2 className='text-lg font-semibold mb-3'>Manage Subscription</h2>
      <button
        onClick={handlePortalRedirect}
        className='bg-blue-500 text-white p-2 rounded w-full mb-2'
        disabled={loading}
      >
        Manage Subscription
      </button>
      <button
        onClick={handleCancelSubscription}
        className='bg-red-500 text-white p-2 rounded w-full'
        disabled={loading}
      >
        Cancel Subscription
      </button>
    </div>
  )
}
