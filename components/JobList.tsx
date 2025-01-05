'use client'

import { Prisma } from '@prisma/client'
import { useState } from 'react'

type JobWithChildren = Prisma.jobGetPayload<{
  include: { jobDescription: true; jobEducation: true; jobResponsibility: true }
}>

export default function JobList({
  initialJobs,
}: {
  initialJobs: JobWithChildren[]
}) {
  const details: string[] = []
  for (let job of initialJobs) {
    details.push('hidden')
  }

  const [jobs, setJobs] = useState(initialJobs)
  const [showDetails, setShowDetails] = useState(details)

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

  return (
    <>
      {jobs.map((job, jobIndex) => {
        return (
          <div key={job.id}>
            <div className='flex items-center'>
              <h2>{job.title}</h2>
              <button
                className='bg-green-500 my-1 ml-2 px-2'
                type='button'
                onClick={() => toggleDetails(jobIndex)}
              >
                {showDetails[jobIndex] == 'hidden' ? 'Show' : 'Hide'} details
                for {job.title}
              </button>
              <button
                className='bg-purple-600 my-1 ml-2 px-2'
                type='button'
                onClick={() => deleteJob(job.id, jobIndex)}
              >
                Delete {job.title}
              </button>
            </div>
            <div className={showDetails[jobIndex]}>
              <h2>Description</h2>
              {job.jobDescription.map((desc) => {
                return <p key={desc.id}>{desc.description}</p>
              })}
              <h2>Education</h2>
              <ul>
                {job.jobEducation.map((edu) => {
                  return (
                    <li className='list-disc' key={edu.id}>
                      {edu.field}
                      {edu.required == 'PREFERRED' && null}
                    </li>
                  )
                })}
              </ul>
              <h2>Responsibilities</h2>
              <ul>
                {job.jobResponsibility.map((resp) => {
                  return (
                    <li className='list-disc' key={resp.id}>
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
