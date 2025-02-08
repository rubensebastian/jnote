'use client'

import { Prisma } from '@prisma/client'
import type { education, responsibility } from '@prisma/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { JwtPayload } from 'jsonwebtoken'

type ExperienceWithResponsibility = Prisma.experienceGetPayload<{
  include: { responsibility: true }
}>

interface ResumeEditableProps {
  educations: education[]
  experiences: ExperienceWithResponsibility[]
  user: JwtPayload
}

interface NewEducation {
  applicant_id: number
  field: string
  start_date: Date
  end_date: Date | null
  institution: string
  level: string
}

type NewExperience = {
  responsibility: {
    description: string
  }[]
} & {
  applicant_id: number
  start_date: Date
  end_date: Date | null
  organization: string
  title: string
}

export default function ResumeEditable({
  educations: initialEducations,
  experiences: initialExperiences,
  user,
}: ResumeEditableProps) {
  const router = useRouter()
  const [educations, setEducations] = useState(initialEducations)
  const [createEducations, setCreateEducations] = useState<NewEducation[]>([])
  const [deleteEducations, setDeleteEducations] = useState<education[]>([])

  const [experiences, setExperiences] = useState(initialExperiences)
  const [createExperiences, setCreateExperiences] = useState<NewExperience[]>(
    []
  )
  const [deleteExperiences, setDeleteExperiences] = useState<
    ExperienceWithResponsibility[]
  >([])

  const [deleteResponsibilities, setDeleteResponsibilities] = useState<
    responsibility[]
  >([])

  const [errorMessage, setErrorMessage] = useState('')

  const handleEducationChange = (index: number, field: string, value: any) => {
    setEducations((prev) =>
      prev.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu))
    )
  }

  const handleNewEducationChange = (
    index: number,
    field: string,
    value: any
  ) => {
    setCreateEducations((prev) =>
      prev.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu))
    )
  }

  const handleExperienceChange = (index: number, field: string, value: any) => {
    setExperiences((prev) =>
      prev.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp))
    )
  }

  const handleNewExperienceChange = (
    index: number,
    field: string,
    value: any
  ) => {
    setCreateExperiences((prev) =>
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

  const handleNewResponsibilityChange = (
    expIndex: number,
    respIndex: number,
    value: string
  ) => {
    setCreateExperiences((prev) =>
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
      }))

      const safeDeleteEducations = deleteEducations.map((edu) => ({
        ...edu,
        id: edu.id.toString(),
      }))

      const safeDeleteResponsibilities = deleteResponsibilities.map((resp) => ({
        ...resp,
        experience_id: resp.experience_id.toString(),
        id: resp.id.toString(),
      }))

      const safeDeleteExperiences = deleteExperiences.map((exp) => ({
        ...exp,
        id: exp.id.toString(),
        applicant_id: exp.applicant_id.toString(),
        responsibility: exp.responsibility.map((resp) => ({
          ...resp,
          id: resp.id.toString(),
          experience_id: resp.experience_id.toString(),
        })),
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
          createEducations: createEducations,
          deleteEducations: safeDeleteEducations,
          deleteResponsibilities: safeDeleteResponsibilities,
          experiences: safeExperiences,
          deleteExperiences: safeDeleteExperiences,
          createExperiences: createExperiences,
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

  const deleteEducation = (index: number) => {
    const educationsCopy = [...educations]
    const newDeleteEducation = educationsCopy.splice(index, 1)
    setEducations(educationsCopy)
    setDeleteEducations([...deleteEducations, newDeleteEducation[0]])
  }

  const deleteNewEducation = (index: number) => {
    const educationsCopy = [...createEducations]
    educationsCopy.splice(index, 1)
    setCreateEducations(educationsCopy)
  }

  const createEducation = () => {
    const newEducation: NewEducation = {
      applicant_id: user.id,
      field: 'Field',
      start_date: new Date(),
      end_date: null,
      institution: 'Institution',
      level: 'Degree Level',
    }
    setCreateEducations([...createEducations, newEducation])
  }

  const deleteExperience = (index: number) => {
    const experiencesCopy = [...experiences]
    const newDeleteExperience = experiencesCopy.splice(index, 1)
    setExperiences(experiencesCopy)
    setDeleteExperiences([...deleteExperiences, newDeleteExperience[0]])
  }

  const deleteNewExperience = (index: number) => {
    const experiencesCopy = [...createExperiences]
    experiencesCopy.splice(index, 1)
    setCreateExperiences(experiencesCopy)
  }

  const createExperience = () => {
    const newExperience: NewExperience = {
      applicant_id: user.id,
      start_date: new Date(),
      end_date: null,
      organization: '',
      title: '',
      responsibility: [
        {
          description: '',
        },
        {
          description: '',
        },
        {
          description: '',
        },
      ],
    }
    setCreateExperiences([...createExperiences, newExperience])
  }

  const deleteResponsibility = (expIndex: number, respIndex: number) => {
    const newExperiences = experiences.map((experience, experienceIndex) => {
      if (expIndex !== experienceIndex) return experience

      const newResponsibility = [...experience['responsibility']]
      const deleteResponsibility = newResponsibility.splice(respIndex, 1)
      setDeleteResponsibilities([
        ...deleteResponsibilities,
        deleteResponsibility[0],
      ])
      return { ...experience, responsibility: newResponsibility }
    })
    setExperiences(newExperiences)
  }

  const deleteNewResponsibility = (expIndex: number, respIndex: number) => {
    const newCreateExperiences: NewExperience[] = createExperiences.map(
      (experience, experienceIndex) => {
        if (expIndex !== experienceIndex) return experience

        const newResponsibility = [...experience['responsibility']]
        newResponsibility.splice(respIndex, 1)
        return { ...experience, responsibility: newResponsibility }
      }
    )
    setCreateExperiences(newCreateExperiences)
  }

  const createResponsibility = (expIndex: number, expID: bigint) => {
    const newResponsibility = {
      id: BigInt(-1),
      experience_id: expID,
      description: '',
    }
    const newExperiences = experiences.map((experience, experienceIndex) => {
      if (expIndex !== experienceIndex) return experience

      const newResponsibilities = [...experience['responsibility']]
      newResponsibilities.push(newResponsibility)

      return { ...experience, responsibility: newResponsibilities }
    })
    setExperiences(newExperiences)
  }

  const createNewResponsibility = (expIndex: number) => {
    const newResponsibility = {
      description: '',
    }
    const newExperiences = createExperiences.map(
      (experience, experienceIndex) => {
        if (expIndex !== experienceIndex) return experience

        const newResponsibilities = [...experience['responsibility']]
        newResponsibilities.push(newResponsibility)

        return { ...experience, responsibility: newResponsibilities }
      }
    )
    setCreateExperiences(newExperiences)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className='mt-4'>Education</h2>
      <ul>
        {educations.map((education, index) => (
          <li key={education.id.toString()}>
            <div className='flex flex-row my-2'>
              <input
                name='institution'
                value={education.institution}
                onChange={(e) =>
                  handleEducationChange(index, 'institution', e.target.value)
                }
              />
              <button
                className='bg-green-500 ml-2 px-1'
                type='button'
                onClick={() => {
                  deleteEducation(index)
                }}
              >
                Delete Education
              </button>
            </div>
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
                  value={new Date(education.start_date)
                    .toISOString()
                    .slice(0, 10)}
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
                      ? new Date(education.end_date).toISOString().slice(0, 10)
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
      <ul>
        {createEducations.map((education, index) => (
          <li key={index}>
            <div className='flex flex-row my-2'>
              <input
                name='institution'
                value={education.institution}
                onChange={(e) =>
                  handleNewEducationChange(index, 'institution', e.target.value)
                }
              />
              <button
                className='bg-green-500 ml-2 px-1'
                type='button'
                onClick={() => {
                  deleteNewEducation(index)
                }}
              >
                Delete Education
              </button>
            </div>
            <div className='flex flex-row justify-between'>
              <div>
                <input
                  name='level'
                  value={education.level}
                  onChange={(e) =>
                    handleNewEducationChange(index, 'level', e.target.value)
                  }
                />{' '}
                of{' '}
                <input
                  name='field'
                  value={education.field}
                  onChange={(e) =>
                    handleNewEducationChange(index, 'field', e.target.value)
                  }
                />
              </div>
              <div>
                <input
                  type='date'
                  name='start_date'
                  value={new Date(education.start_date)
                    .toISOString()
                    .slice(0, 10)}
                  onChange={(e) =>
                    handleNewEducationChange(
                      index,
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
                    education.end_date
                      ? new Date(education.end_date).toISOString().slice(0, 10)
                      : ''
                  }
                  onChange={(e) =>
                    handleNewEducationChange(index, 'end_date', e.target.value)
                  }
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button
        className='bg-green-500 mt-2 px-2'
        type='button'
        onClick={createEducation}
      >
        Add New Education
      </button>

      <h2 className='mt-2'>Experience</h2>
      <ul>
        {experiences.map((experience, expIndex) => (
          <li key={experience.id.toString()} className='pb-4 mb-4 border-b-2'>
            <div className='flex flex-row flex-wrap justify-between'>
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
                <button
                  className='bg-green-500 ml-2 px-1'
                  type='button'
                  onClick={() => {
                    deleteExperience(expIndex)
                  }}
                >
                  Delete Experience
                </button>
              </div>
              <div>
                <input
                  type='date'
                  name='start_date'
                  value={new Date(experience.start_date)
                    .toISOString()
                    .slice(0, 10)}
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
                      ? new Date(experience.end_date).toISOString().slice(0, 10)
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
                <ul>
                  {experience.responsibility.map((resp, respIndex) => (
                    <li key={respIndex} className='mt-2 flex flex-row'>
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
                      <button
                        className='bg-green-500 ml-2 px-1'
                        type='button'
                        onClick={() => {
                          deleteResponsibility(expIndex, respIndex)
                        }}
                      >
                        Delete Resp.
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            <button
              className='bg-green-500 my-1 px-2'
              type='button'
              onClick={() => createResponsibility(expIndex, experience.id)}
            >
              Add New Repsonsibility
            </button>
          </li>
        ))}
      </ul>
      <ul>
        {createExperiences.map((experience, expIndex) => (
          <li key={expIndex} className='pb-4 mb-4 border-b-2'>
            <div className='flex flex-row flex-wrap justify-between'>
              <div>
                <input
                  name='title'
                  value={experience.title}
                  onChange={(e) =>
                    handleNewExperienceChange(expIndex, 'title', e.target.value)
                  }
                />{' '}
                at{' '}
                <input
                  name='organization'
                  value={experience.organization}
                  onChange={(e) =>
                    handleNewExperienceChange(
                      expIndex,
                      'organization',
                      e.target.value
                    )
                  }
                />
                <button
                  className='bg-green-500 ml-2 px-1'
                  type='button'
                  onClick={() => {
                    deleteNewExperience(expIndex)
                  }}
                >
                  Delete Experience
                </button>
              </div>
              <div>
                <input
                  type='date'
                  name='start_date'
                  value={new Date(experience.start_date)
                    .toISOString()
                    .slice(0, 10)}
                  onChange={(e) =>
                    handleNewExperienceChange(
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
                      ? new Date(experience.end_date).toISOString().slice(0, 10)
                      : ''
                  }
                  onChange={(e) =>
                    handleNewExperienceChange(
                      expIndex,
                      'end_date',
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
            {experience.responsibility &&
              experience.responsibility.length > 0 && (
                <ul>
                  {experience.responsibility.map((resp, respIndex) => (
                    <li key={respIndex} className='mt-2 flex flex-row'>
                      <textarea
                        className='w-full'
                        value={resp.description}
                        onChange={(e) =>
                          handleNewResponsibilityChange(
                            expIndex,
                            respIndex,
                            e.target.value
                          )
                        }
                      />
                      <button
                        className='bg-green-500 ml-2 px-1'
                        type='button'
                        onClick={() => {
                          deleteNewResponsibility(expIndex, respIndex)
                        }}
                      >
                        Delete Resp.
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            <button
              className='bg-green-500 my-1 px-2'
              type='button'
              onClick={() => createNewResponsibility(expIndex)}
            >
              Add New Repsonsibility
            </button>
          </li>
        ))}
      </ul>
      <button
        className='bg-green-500 my-1 px-2'
        type='button'
        onClick={createExperience}
      >
        Add New Experience
      </button>
      <br />
      <div>{errorMessage}</div>
      <button className='bg-green-500 my-1 px-2' type='submit'>
        Save Changes
      </button>
    </form>
  )
}
