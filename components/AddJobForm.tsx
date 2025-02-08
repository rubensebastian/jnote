'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Job = {
  applicant_id: number
  organization: string
  title: string
  applied_at: Date | null
}

type JobDetails = {
  descriptions: string
  requiredEducation: string
  preferredEducation: string
  requiredResponsibilities: string
  preferredResponsibilities: string
}

export default function AddJobForm({ userID }: { userID: number }) {
  const [job, setJob] = useState<Job>({
    applicant_id: userID,
    organization: '',
    title: '',
    applied_at: null,
  })

  const [jobDetails, setJobDetails] = useState<JobDetails>({
    descriptions: '',
    requiredEducation: '',
    preferredEducation: '',
    requiredResponsibilities: '',
    preferredResponsibilities: '',
  })

  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const handleJobChange = (field: keyof Job, value: any) => {
    setJob((prev) => ({ ...prev, [field]: value }))
  }

  const handleJobDetailsChange = (field: keyof JobDetails, value: any) => {
    setJobDetails((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    try {
      const response = await fetch('/api/jobs/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job, jobDetails }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to update resume')
      }

      router.push('/jobs')
    } catch (error: any) {
      setErrorMessage(error.message || 'An unexpected error occurred')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Job Details</h2>
      <label htmlFor='title'>Position Title</label>
      <br />
      <input
        name='title'
        value={job.title}
        onChange={(e) => handleJobChange('title', e.target.value)}
      />
      <br />
      <label htmlFor='organization'>Organization</label>
      <br />
      <input
        name='organization'
        value={job.organization}
        onChange={(e) => handleJobChange('organization', e.target.value)}
      />

      <h2>Job Description</h2>
      <textarea
        name='descriptions'
        value={jobDetails.descriptions}
        onChange={(e) => handleJobDetailsChange('descriptions', e.target.value)}
      />

      <h2>Education Requirements</h2>
      <label>Required:</label>
      <textarea
        name='requiredEducation'
        value={jobDetails.requiredEducation}
        onChange={(e) =>
          handleJobDetailsChange('requiredEducation', e.target.value)
        }
      />
      <br />
      <label>Preferred:</label>
      <textarea
        name='preferredEducation'
        value={jobDetails.preferredEducation}
        onChange={(e) =>
          handleJobDetailsChange('preferredEducation', e.target.value)
        }
      />

      <h2>Responsibilities</h2>
      <label>Required:</label>
      <textarea
        name='requiredResponsibilities'
        value={jobDetails.requiredResponsibilities}
        onChange={(e) =>
          handleJobDetailsChange('requiredResponsibilities', e.target.value)
        }
      />
      <br />
      <label>Preferred:</label>
      <textarea
        name='preferredResponsibilities'
        value={jobDetails.preferredResponsibilities}
        onChange={(e) =>
          handleJobDetailsChange('preferredResponsibilities', e.target.value)
        }
      />

      <div>{errorMessage}</div>
      <button className='bg-green-500 my-1 px-2' type='submit'>
        Save Changes
      </button>
    </form>
  )
}
