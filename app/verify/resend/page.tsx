'use client'

import { sendVerificationEmail } from '@/lib/email'
import { useState } from 'react'

export default function Resend() {
  const [timer, setTimer] = useState(0)
  return (
    <div>
      {timer}
      <p>Click the button below to resend the verification email</p>
      <button
        className='bg-green-500 my-1 px-2'
        type='button'
        onClick={() => sendVerificationEmail('', '')}
      >
        Resend Verification Email
      </button>
    </div>
  )
}
