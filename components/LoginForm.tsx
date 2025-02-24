'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    setMessage('')
    e.preventDefault()

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    const data = await res.json()
    console.log(data)
    if (data.token) {
      router.push('/jobs')
    } else {
      setMessage(data.message)
    }
  }

  return (
    <div className='w-full max-w-md mx-auto p-4 bg-slate-800 rounded-lg shadow-md'>
      <h2 className='text-xl font-semibold text-center mb-4'>Log In</h2>
      <form onSubmit={handleSubmit}>
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
        <button
          type='submit'
          className='w-full bg-green-500 text-white p-2 rounded-lg hover:bg-blue-600'
        >
          Log In
        </button>
      </form>
      {message && <p className='text-center text-red-500 mt-4'>{message}</p>}
    </div>
  )
}

export default LoginForm
