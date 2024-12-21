import prisma from '@/lib/prisma'

export default async function Jobs() {
  return (
    <main className='max-w-2xl mx-auto p-4'>
      <h1 className='text-center'>Jobs</h1>
      <p>Here are some jobs</p>
    </main>
  )
}
