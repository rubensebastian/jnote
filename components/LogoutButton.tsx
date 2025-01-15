'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        router.push('/')
      } else {
        alert('Failed to logout')
      }
    } catch (error) {
      alert(error)
    }
  }

  return (
    <button onClick={handleLogout} className='bg-green-500 mt-2 px-2'>
      Logout
    </button>
  )
}
