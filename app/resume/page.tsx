import prisma from '@/lib/prisma'

export default async function Resume() {
  const educations = await prisma.education.findMany()
  const experiences = await prisma.experience.findMany({
    include: { responsibility: true },
  })

  return (
    <main className='max-w-2xl mx-auto p-4'>
      <h1 className='text-center'>Resume</h1>
      <h2 className='text-center'>Education</h2>
      <ul>
        {educations.map((education) => (
          <li key={education.id.toString()}>
            <h3>{education.institution}</h3>
            <div className='flex flex-row justify-between'>
              <p>
                {education.level} of {education.field}
              </p>
              <p>
                {new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  year: 'numeric',
                }).format(education.start_date)}{' '}
                -{' '}
                {education.end_date
                  ? new Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      year: 'numeric',
                    }).format(education.end_date)
                  : 'Present'}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <h2 className='text-center'>Experience</h2>
      <ul>
        {experiences.map((experience) => (
          <li key={experience.id.toString()} className='mb-2'>
            <div className='flex flex-row justify-between'>
              <h3>
                {experience.title} at {experience.organization}
              </h3>
              <p>
                {new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  year: 'numeric',
                }).format(experience.start_date)}{' '}
                -{' '}
                {experience.end_date
                  ? new Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      year: 'numeric',
                    }).format(experience.end_date)
                  : 'Present'}
              </p>
            </div>
            {experience.responsibility &&
              experience.responsibility.length > 0 && (
                <ul className='ml-4 list-disc'>
                  {experience.responsibility.map((responsibility) => (
                    <li key={responsibility.id.toString()}>
                      {responsibility.description}
                    </li>
                  ))}
                </ul>
              )}
          </li>
        ))}
      </ul>
    </main>
  )
}
