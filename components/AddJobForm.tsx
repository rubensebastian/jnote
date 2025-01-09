'use client'

import { JwtPayload } from 'jsonwebtoken'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Job = {
  applicant_id: number
  organization: string
  title: string
  applied_at: Date | null
}
type JobDescription = {
  description: string
  order: number
}

type JobEducation = {
  field: string
  required: 'REQUIRED' | 'PREFERRED'
}

type JobResponsibility = {
  description: string
  required: 'REQUIRED' | 'PREFERRED'
}

export default function AddJobForm(user: JwtPayload) {
  const [job, setJob] = useState<Job>({
    applicant_id: user.id,
    organization: '',
    title: '',
    applied_at: null,
  })
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([
    {
      description: '',
      order: 0,
    },
    {
      description: '',
      order: 1,
    },
  ])
  const [jobEducations, setJobEducations] = useState<JobEducation[]>([
    {
      field: '',
      required: 'REQUIRED',
    },
  ])
  const [jobResponsibilities, setJobResponsibilities] = useState<
    JobResponsibility[]
  >([
    {
      description: '',
      required: 'REQUIRED',
    },
    {
      description: '',
      required: 'REQUIRED',
    },
  ])
  const [errorMessage, setErrorMessage] = useState('')

  const router = useRouter()

  const handleJobChange = (field: string, value: any) => {
    const newJob = { ...job, [field]: value }
    setJob(newJob)
  }
  const handleJobDescriptionChange = (
    descIndex: number,
    field: string,
    value: any
  ) => {
    const newJobDescriptions = jobDescriptions.map((description, index) => {
      if (descIndex !== index) return description

      return { ...description, [field]: value }
    })
    setJobDescriptions(newJobDescriptions)
  }
  const handleJobEducationChange = (
    eduIndex: number,
    field: string,
    value: any
  ) => {
    if (field === 'required') {
      if (value) {
        value = 'REQUIRED'
      } else {
        value = 'PREFERRED'
      }
    }

    const newJobEducations = jobEducations.map((education, index) => {
      if (eduIndex !== index) return education

      return { ...education, [field]: value }
    })
    setJobEducations(newJobEducations)
  }
  const handleJobResponsibilityChange = (
    respIndex: number,
    field: string,
    value: any
  ) => {
    if (field === 'required') {
      if (value) {
        value = 'REQUIRED'
      } else {
        value = 'PREFERRED'
      }
    }

    const newJobResponsibilities = jobResponsibilities.map(
      (responsibility, index) => {
        if (respIndex !== index) return responsibility

        return { ...responsibility, [field]: value }
      }
    )
    setJobResponsibilities(newJobResponsibilities)
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    try {
      const response = await fetch('/api/jobs/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job,
          jobDescriptions,
          jobEducations,
          jobResponsibilities,
        }),
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

  const addJobDescription = () => {
    const currentOrder = jobDescriptions[jobDescriptions.length - 1]['order']
    const newJobDescription: JobDescription = {
      description: '',
      order: currentOrder + 1,
    }
    setJobDescriptions([...jobDescriptions, newJobDescription])
  }
  const addJobEducation = () => {
    const newJobEducation: JobEducation = {
      field: '',
      required: 'REQUIRED',
    }
    setJobEducations([...jobEducations, newJobEducation])
  }
  const addJobResponsibility = () => {
    const newJobResponsibility: JobResponsibility = {
      description: '',
      required: 'REQUIRED',
    }
    setJobResponsibilities([...jobResponsibilities, newJobResponsibility])
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
      <ul>
        {jobDescriptions.map((description, descIndex) => {
          return (
            <div key={descIndex}>
              <li className='list-disc'>
                <input
                  name='descriptionDescription'
                  value={description.description}
                  onChange={(e) =>
                    handleJobDescriptionChange(
                      descIndex,
                      'description',
                      e.target.value
                    )
                  }
                />
              </li>
            </div>
          )
        })}
      </ul>
      <button
        className='bg-green-500 my-1 px-2'
        type='button'
        onClick={addJobDescription}
      >
        Add Description
      </button>
      <h2>Education Requirements</h2>
      <ul>
        {jobEducations.map((edu, eduIndex) => {
          return (
            <div key={eduIndex}>
              <li className='list-disc'>
                <input
                  value={edu.field}
                  name='eduField'
                  onChange={(e) =>
                    handleJobEducationChange(eduIndex, 'field', e.target.value)
                  }
                />
                <input
                  name='eduRequired'
                  type='checkbox'
                  value={edu.required}
                  checked={edu.required == 'REQUIRED' ? true : false}
                  onChange={(e) =>
                    handleJobEducationChange(
                      eduIndex,
                      'required',
                      e.target.checked
                    )
                  }
                />
                <label htmlFor='required'>Required?</label>
              </li>
            </div>
          )
        })}
      </ul>
      <button
        className='bg-green-500 my-1 px-2'
        type='button'
        onClick={addJobEducation}
      >
        Add Education
      </button>
      <h2>Responsibilities</h2>
      <ul>
        {jobResponsibilities.map((responsibility, respIndex) => {
          return (
            <div key={respIndex}>
              <li className='list-disc'>
                <input
                  name='respDescription'
                  value={responsibility.description}
                  onChange={(e) =>
                    handleJobResponsibilityChange(
                      respIndex,
                      'description',
                      e.target.value
                    )
                  }
                />
                <input
                  name='respRequired'
                  type='checkbox'
                  checked={responsibility.required == 'REQUIRED' ? true : false}
                  onChange={(e) =>
                    handleJobResponsibilityChange(
                      respIndex,
                      'required',
                      e.target.checked
                    )
                  }
                />
                <label htmlFor='respRequired'>Required?</label>
              </li>
            </div>
          )
        })}
      </ul>
      <button
        className='bg-green-500 my-1 px-2'
        type='button'
        onClick={addJobResponsibility}
      >
        Add Responsibility
      </button>
      <div>{errorMessage}</div>
      <button className='bg-green-500 my-1 px-2' type='submit'>
        Save Changes
      </button>
    </form>
  )
}
