'use client'

import { Prisma } from '@prisma/client'
import type { education } from '@prisma/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type ExperienceWithResponsibility = Prisma.experienceGetPayload<{
  include: { responsibility: true }
}>

interface ResumeEditableProps {
  educations: education[]
  experiences: ExperienceWithResponsibility[]
}

export default function ResumeEditable({
  educations: initialEducations,
  experiences: initialExperiences,
}: ResumeEditableProps) {
  const [educations, setEducations] = useState(initialEducations)
  const [experiences, setExperiences] = useState(initialExperiences)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const handleEducationChange = (index: number, field: string, value: any) => {
    setEducations((prev) =>
      prev.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu))
    )
  }

  const handleExperienceChange = (index: number, field: string, value: any) => {
    setExperiences((prev) =>
      prev.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp))
    )
  }

  const handleResponsibilityChange = (
    expIndex: number,
    respIndex: number,
    value: string
  ) => {
    setExperiences((prev) =>
      prev.map((exp, i) =>
        i === expIndex
          ? {
              ...exp,
              responsibility: exp.responsibility.map((resp, j) =>
                j === respIndex ? { ...resp, description: value } : resp
              ),
            }
          : exp
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    try {
      // Convert BigInt to string in educations and experiences
      const safeEducations = educations.map((edu) => ({
        ...edu,
        id: edu.id.toString(),
        applicant_id: edu.applicant_id.toString(),
      }))

      const safeExperiences = experiences.map((exp) => ({
        ...exp,
        id: exp.id.toString(),
        applicant_id: exp.applicant_id.toString(),
        responsibility: exp.responsibility.map((resp) => ({
          ...resp,
          id: resp.id.toString(),
          experience_id: resp.experience_id.toString(),
        })),
      }))

      const response = await fetch('/api/update-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          educations: safeEducations,
          experiences: safeExperiences,
        }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to update resume')
      }

      router.push('/resume')
    } catch (error: any) {
      setErrorMessage(error.message || 'An unexpected error occurred')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className='text-center'>Education</h2>
      <ul className='border-red-500 border-2'>
        {educations.map((education, index) => (
          <li key={education.id.toString()}>
            <h3>{education.institution}</h3>
            <div className='flex flex-row justify-between'>
              <div>
                <input
                  name='level'
                  value={education.level}
                  onChange={(e) =>
                    handleEducationChange(index, 'level', e.target.value)
                  }
                />{' '}
                of{' '}
                <input
                  name='field'
                  value={education.field}
                  onChange={(e) =>
                    handleEducationChange(index, 'field', e.target.value)
                  }
                />
              </div>
              <div>
                <input
                  type='date'
                  name='start_date'
                  value={
                    new Date(education.start_date).toISOString().split('T')[0]
                  }
                  onChange={(e) =>
                    handleEducationChange(index, 'start_date', e.target.value)
                  }
                />{' '}
                -{' '}
                <input
                  type='date'
                  name='end_date'
                  value={
                    education.end_date
                      ? new Date(education.end_date).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    handleEducationChange(index, 'end_date', e.target.value)
                  }
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <h2 className='text-center'>Experience</h2>
      <ul className='border-red-500 border-2'>
        {experiences.map((experience, expIndex) => (
          <li key={experience.id.toString()} className='mb-2'>
            <div className='flex flex-row justify-between'>
              <div>
                <input
                  name='title'
                  value={experience.title}
                  onChange={(e) =>
                    handleExperienceChange(expIndex, 'title', e.target.value)
                  }
                />{' '}
                at{' '}
                <input
                  name='organization'
                  value={experience.organization}
                  onChange={(e) =>
                    handleExperienceChange(
                      expIndex,
                      'organization',
                      e.target.value
                    )
                  }
                />
              </div>
              <div>
                <input
                  type='date'
                  name='start_date'
                  value={
                    new Date(experience.start_date).toISOString().split('T')[0]
                  }
                  onChange={(e) =>
                    handleExperienceChange(
                      expIndex,
                      'start_date',
                      e.target.value
                    )
                  }
                />{' '}
                -{' '}
                <input
                  type='date'
                  name='end_date'
                  value={
                    experience.end_date
                      ? new Date(experience.end_date)
                          .toISOString()
                          .split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    handleExperienceChange(expIndex, 'end_date', e.target.value)
                  }
                />
              </div>
            </div>
            {experience.responsibility &&
              experience.responsibility.length > 0 && (
                <ul className='mt-4'>
                  {experience.responsibility.map((resp, respIndex) => (
                    <li key={resp.id.toString()} className='mt-2'>
                      <textarea
                        className='w-full'
                        value={resp.description}
                        onChange={(e) =>
                          handleResponsibilityChange(
                            expIndex,
                            respIndex,
                            e.target.value
                          )
                        }
                      />
                    </li>
                  ))}
                </ul>
              )}
          </li>
        ))}
      </ul>
      <div>{errorMessage}</div>
      <button className='bg-green-500' type='submit'>
        Save Changes
      </button>
    </form>
  )
}
