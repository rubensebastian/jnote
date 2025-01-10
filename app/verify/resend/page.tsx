'use client'

import { sendVerificationEmail } from '@/lib/email'

export default function Resend() {
  return (
    <div>
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
