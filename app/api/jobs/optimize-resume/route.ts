import { pipeline, DataArray } from '@huggingface/transformers'
import { NextResponse, NextRequest } from 'next/server'
import { cosineSimilarity } from '@/lib/utils'
import prisma from '@/lib/prisma'

const pipe = await pipeline('feature-extraction')

type ResponsibilityWithEmbedding = {
  description: string
  required: 'REQUIRED' | 'PREFERRED'
  embedding: DataArray
}

type DescriptionWithEmbedding = {
  description: string
  embedding: DataArray
}

type EducationWithEmbedding = {
  field: string
  required: 'REQUIRED' | 'PREFERRED'
  embedding: DataArray
}

type WeightedResponsibility = {
  id: string
  weight: number
  description: string
}

type WeightedExperience = {
  id: string
  title: string
  weightedResponsibilities: WeightedResponsibility[]
}

type WeightedEducation = {
  id: string
  field: string
  institution: string
  weight: number
}

const preferredWeight = 0.75
const descriptionWeight = 0.5

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { job } = data
    const userID = job.applicant_id

    const applicant = await prisma.applicant.findUnique({
      where: { id: Number(userID) },
    })
    if (!applicant) {
      return NextResponse.json(
        {
          success: false,
          error: "You don't seem to be logged in. Try doing that.",
        },
        { status: 500 }
      )
    }

    if (applicant.number_of_generates < 1) {
      return NextResponse.json(
        {
          success: false,
          error: "You don't have any free resume optimizations this month ):",
        },
        { status: 500 }
      )
    }

    const educations = await prisma.education.findMany({
      where: { applicant_id: userID },
    })
    const experiences = await prisma.experience.findMany({
      where: { applicant_id: userID },
      include: { responsibility: true },
    })

    const educationsWithEmbeddings: EducationWithEmbedding[] = []
    for (let jobEdu of job.jobEducation) {
      const embedding = (
        await pipe(jobEdu.field, { pooling: 'mean', normalize: true })
      ).data
      educationsWithEmbeddings.push({ ...jobEdu, embedding: embedding })
    }

    const weightedEducations: WeightedEducation[] = []
    for (let edu of educations) {
      const newField = edu.level + ' of ' + edu.field
      const weightedEducation: WeightedEducation = {
        id: edu.id.toString(),
        field: newField,
        institution: edu.institution,
        weight: 0,
      }
      const eduEmbedding = (
        await pipe(newField, { pooling: 'mean', normalize: true })
      ).data
      for (let eduWithEmbed of educationsWithEmbeddings) {
        const similarityScore = cosineSimilarity(
          eduEmbedding,
          eduWithEmbed.embedding
        )

        weightedEducation.weight +=
          similarityScore *
          (eduWithEmbed.required == 'REQUIRED' ? 1 : preferredWeight)
      }
      weightedEducations.push(weightedEducation)
    }

    const responsibilitiesWithEmbeddings: ResponsibilityWithEmbedding[] = []
    for (let jobResp of job.jobResponsibility) {
      const embedding = (
        await pipe(jobResp.description, { pooling: 'mean', normalize: true })
      ).data
      responsibilitiesWithEmbeddings.push({ ...jobResp, embedding: embedding })
    }

    const descriptionsWithEmbeddings: DescriptionWithEmbedding[] = []
    for (let jobDesc of job.jobDescription) {
      const embedding = (
        await pipe(jobDesc.description, { pooling: 'mean', normalize: true })
      ).data
      descriptionsWithEmbeddings.push({
        description: jobDesc.description,
        embedding: embedding,
      })
    }

    const weightedExperiences: WeightedExperience[] = []
    for (let exp of experiences) {
      const weightedExperience: WeightedExperience = {
        id: exp.id.toString(),
        title: exp.title,
        weightedResponsibilities: [],
      }
      for (let resp of exp.responsibility) {
        const weightedResponsibility: WeightedResponsibility = {
          id: resp.id.toString(),
          weight: 0,
          description: resp.description,
        }

        const respEmbedding = (
          await pipe(resp.description, { pooling: 'mean', normalize: true })
        ).data
        for (let respWithEmbed of responsibilitiesWithEmbeddings) {
          const similarityScore = cosineSimilarity(
            respEmbedding,
            respWithEmbed.embedding
          )
          weightedResponsibility.weight +=
            similarityScore *
            (respWithEmbed.required == 'REQUIRED' ? 1 : preferredWeight)
        }
        for (let descWithEmbed of descriptionsWithEmbeddings) {
          const similarityScore = cosineSimilarity(
            respEmbedding,
            descWithEmbed.embedding
          )
          weightedResponsibility.weight += similarityScore * descriptionWeight
        }
        weightedExperience.weightedResponsibilities.push(weightedResponsibility)
      }
      weightedExperiences.push(weightedExperience)
    }

    await prisma.applicant.update({
      where: { id: Number(userID) },
      data: {
        number_of_generates: applicant.number_of_generates - 1,
      },
    })

    return NextResponse.json({
      success: true,
      weightedExperiences,
      weightedEducations,
      message: `You have ${
        applicant.number_of_generates - 1
      } resume optimizations remaining this month`,
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Unknown error occurred' },
      { status: 500 }
    )
  }
}
