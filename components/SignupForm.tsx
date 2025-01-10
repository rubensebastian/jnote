'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords don't match")
      return
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
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
    <div className='w-full max-w-md mx-auto p-4 bg-slate-800 rounded-lg shadow-md'>
      <h2 className='text-xl font-semibold text-center mb-4'>Sign Up</h2>
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
        <button
          type='submit'
          className='w-full bg-purple-500 text-white p-2 rounded-lg hover:bg-blue-600'
        >
          Register
        </button>
      </form>
      {message && <p className='text-center text-red-500 mt-4'>{message}</p>}
    </div>
  )
}

export default SignupForm
