'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

function VerifyContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [message, setMessage] = useState('Verifying...')

  useEffect(() => {
    if (token) {
      fetch(`/api/auth/verify?token=${token}`)
        .then((res) => res.json())
        .then((data) => setMessage(data.message))
        .catch(() => setMessage('Verification failed.'))
    } else {
      setMessage('Invalid verification link.')
    }
  }, [token])

  return (
    <div className='w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md'>
      <h2 className='text-xl font-semibold text-center mb-4'>
        Email Verification
      </h2>
      <p>{message}</p>
    </div>
  )
}

export default function Verify() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  )
}
