type Education = {
  id: string
  applicant_id: number
  field: string
  start_date: Date
  end_date: Date | null
  institution: string
  level: string
}

type Experience = {
  responsibility: {
    id: string
    experience_id: string
    description: string
  }[]
} & {
  id: string
  applicant_id: number
  start_date: Date
  end_date: Date | null
  organization: string
  title: string
}

export async function fetchGeneratedEmbeddings(
  jobEducations: any,
  resumeEducations: Education[],
  jobDescriptions: any,
  jobResponsibilities: any,
  resumeExperiences: Experience[]
) {
  const response = await fetch(
    `${process.env.EXPRESS_API_URL}/optimize-resume`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobEducations,
        resumeEducations,
        jobDescriptions,
        jobResponsibilities,
        resumeExperiences,
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Error in response: ${response.statusText}`)
  }

  const data = await response.json()
  return data
}
