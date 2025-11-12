'use client'

import { Prisma, Plan } from '@prisma/client'
import { useState } from 'react'
import { generateWordDocument } from '@/lib/utils'
import Link from 'next/link'

type JobWithChildren = Prisma.jobGetPayload<{
  include: { jobDescription: true; jobEducation: true; jobResponsibility: true }
}>

export default function JobList({
  initialJobs,
  numberOfGenerates,
  fullName,
  token,
  email,
  accountLevel,
}: {
  initialJobs: JobWithChildren[]
  numberOfGenerates: number
  fullName: string
  token: string
  email: string
  accountLevel: Plan
}) {
  const details: string[] = []
  for (let i = 0; i < initialJobs.length; i++) {
    details.push('hidden')
  }

  const [jobs, setJobs] = useState(initialJobs)
  const [showDetails, setShowDetails] = useState(details)
  const [numberGenerates, setNumberGenerates] = useState(numberOfGenerates)

  const toggleDetails = (jobIndex: number) => {
    const newDetailsCopy = showDetails.map((detail, detailIndex) => {
      if (jobIndex !== detailIndex) return detail

      if (detail == '') return 'hidden'
      return ''
    })
    setShowDetails(newDetailsCopy)
  }

  const deleteJob = async (jobId: bigint, jobIndex: number) => {
    const response = await fetch('/api/jobs/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobToDelete: jobId.toString(),
      }),
    })
    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.error || 'Failed to delete job')
    }
    const newJobs = [...jobs]
    newJobs.splice(jobIndex, 1)

    setJobs(newJobs)
  }

  const generateEmbedding = async (job: JobWithChildren) => {
    if (
      accountLevel != 'PREMIUM' &&
      accountLevel != 'TESTER' &&
      numberGenerates < 1
    ) {
      alert("You don't have any free resume optimizations this month ):")
      return
    }
    const safeJob = {
      ...job,
      id: job.id.toString(),
      jobDescription: job.jobDescription.map((desc) => ({
        ...desc,
        id: desc.id.toString(),
        job_id: desc.job_id.toString(),
      })),
      jobEducation: job.jobEducation.map((edu) => ({
        ...edu,
        id: edu.id.toString(),
        job_id: edu.job_id.toString(),
      })),
      jobResponsibility: job.jobResponsibility.map((resp) => ({
        ...resp,
        id: resp.id.toString(),
        job_id: resp.job_id.toString(),
      })),
    }

    const response = await fetch('/api/jobs/optimize-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        job: safeJob,
        token,
        email,
      }),
    })

    if (!response.ok) {
      const result = await response.json()
      alert(result.error)
      return
    }
    setNumberGenerates((prev) => prev - 1)
    const result = await response.json()

    await generateWordDocument(
      fullName,
      result.weightedExperiences,
      result.weightedEducations
    )
  }

  return (
    <>
      <p>
        You currently have{' '}
        {accountLevel == 'PREMIUM' || accountLevel == 'TESTER'
          ? 'unlimited'
          : numberGenerates}{' '}
        resume optimizations remaining this month.
      </p>
      {accountLevel != 'PREMIUM' &&
      accountLevel != 'TESTER' &&
      numberGenerates < 1 ? (
        <Link className='bg-highlight rounded-sm my-1 px-2' href='/upgrade'>
          Upgrade Your Account
        </Link>
      ) : null}
      {jobs.map((job, jobIndex) => {
        return (
          <div className='bg-slate-950 px-2 py-1 my-1 rounded-sm' key={job.id}>
            <div className='flex items-center'>
              <h2 className='grow'>{job.title}</h2>
              <button
                className='bg-highlight my-1 ml-2 px-2 rounded-sm'
                type='button'
                onClick={() => toggleDetails(jobIndex)}
              >
                {showDetails[jobIndex] == 'hidden' ? 'Show' : 'Hide'} Job
                Details
                <span className='sr-only'> for {job.title}</span>
              </button>
              <button
                className='bg-sublight my-1 ml-2 px-2 rounded-sm'
                type='button'
                onClick={() => deleteJob(job.id, jobIndex)}
              >
                Delete Job<span className='sr-only'> {job.title}</span>
              </button>
              <button
                className='bg-blue-500 my-1 ml-2 px-2 rounded-sm'
                type='button'
                onClick={() => generateEmbedding(jobs[jobIndex])}
              >
                Optimize Resume<span className='sr-only'> for {job.title}</span>
              </button>
            </div>
            <div className={showDetails[jobIndex]}>
              <h3>Description</h3>
              {job.jobDescription.map((desc) => {
                return <p key={desc.id}>{desc.description}</p>
              })}
              <h3>Education</h3>
              <ul>
                {job.jobEducation.map((edu) => {
                  return (
                    <li className='list-disc pl-2 list-inside' key={edu.id}>
                      {edu.field}
                      {edu.required == 'PREFERRED' && null}
                    </li>
                  )
                })}
              </ul>
              <h3>Responsibilities</h3>
              <ul>
                {job.jobResponsibility.map((resp) => {
                  return (
                    <li className='list-disc pl-2 list-inside' key={resp.id}>
                      {resp.description}
                      {resp.required == 'PREFERRED' && null}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        )
      })}
    </>
  )
}
