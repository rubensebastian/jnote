'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TermsAndConditions from './TermsAndConditions'

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [message, setMessage] = useState('')
  const router = useRouter()
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [showAcceptTerms, setShowAcceptTerms] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match')
      return
    }
    if (!acceptTerms) {
      setMessage('You must first accept terms and conditions')
      return
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        full_name: formData.full_name,
        password: formData.password,
      }),
    })

    const data = await res.json()
    if (data.applicant) {
      router.push('/jobs')
    } else {
      setMessage(data.message)
    }
  }

  return (
    <div className='w-full max-w-lg mx-auto p-4 bg-slate-800 rounded-lg shadow-md'>
      <h2 className='text-xl font-semibold text-center mb-4'>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Username'
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          className='w-full p-2 mb-4 border rounded-lg'
          required
        />
        <input
          type='email'
          placeholder='Email'
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className='w-full p-2 mb-4 border rounded-lg'
          required
        />
        <input
          type='text'
          placeholder='Full Name'
          value={formData.full_name}
          onChange={(e) =>
            setFormData({ ...formData, full_name: e.target.value })
          }
          className='w-full p-2 mb-4 border rounded-lg'
          required
        />
        <input
          type='password'
          placeholder='Password'
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className='w-full p-2 mb-4 border rounded-lg'
          required
        />
        <input
          type='password'
          placeholder='Confirm Password'
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          className='w-full p-2 mb-4 border rounded-lg'
          required
        />
        <input
          type='checkbox'
          name='acceptTerms'
          id='acceptTerms'
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
        />
        <label className='ml-2' htmlFor='acceptTerms'>
          Accept the Terms and Conditions
        </label>
        <br />
        <button
          onClick={() =>
            setShowAcceptTerms((showAcceptTerms) => !showAcceptTerms)
          }
          className='underline text-white'
        >
          Show Terms and Conditions
        </button>
        <div
          hidden={!showAcceptTerms}
          className='bg-white text-black px-2 rounded-md max-h-60 overflow-scroll'
        >
          <TermsAndConditions />
        </div>
        <button
          type='submit'
          className='w-full bg-purple-500 text-white p-2 mt-2 rounded-lg hover:bg-blue-600'
        >
          Register
        </button>
      </form>
      {message && <p className='text-center text-red-500 mt-4'>{message}</p>}
    </div>
  )
}

export default SignupForm
