import { pipeline, DataArray } from '@huggingface/transformers'
import { NextResponse, NextRequest } from 'next/server'
import { cosineSimilarity } from '@/lib/utils'
import prisma from '@/lib/prisma'

const pipe = await pipeline('embeddings')

type ResponsibilityWithEmbedding = {
  description: string
  required: 'REQUIRED' | 'PREFERRED'
  embedding: DataArray
}

type DescriptionWithEmbedding = {
  description: string
  embedding: DataArray
}

type Similarity = {
  jobResponsibility: string
  resumeResponsibility: string
  similarityScore: number
}

export async function POST(req: NextRequest) {
  try {
    const results = []
    const data = await req.json()
    const { job } = data
    const userID = job.applicant_id

    const educations = await prisma.education.findMany({
      where: { applicant_id: userID },
    })
    const experiences = await prisma.experience.findMany({
      where: { applicant_id: userID },
      include: { responsibility: true },
    })

    const responsibilitiesWithEmbeddings: ResponsibilityWithEmbedding[] = []
    for (let jobResp of job.jobResponsibility) {
      const embedding = (await pipe(jobResp.description)).data
      responsibilitiesWithEmbeddings.push({ ...jobResp, embedding: embedding })
    }
    const descriptionsWithEmbeddings: DescriptionWithEmbedding[] = []
    for (let jobDesc of job.jobDescription) {
      const embedding = (await pipe(jobDesc.description)).data
      descriptionsWithEmbeddings.push({
        description: jobDesc.description,
        embedding: embedding,
      })
    }

    const similarities: Similarity[] = []
    for (let exp of experiences) {
      for (let resp of exp.responsibility) {
        const respEmbedding = (await pipe(resp.description)).data
        for (let respWithEmbed of responsibilitiesWithEmbeddings) {
          const similarityScore = cosineSimilarity(
            respEmbedding,
            respWithEmbed.embedding
          )
          similarities.push({
            jobResponsibility: respWithEmbed.description,
            resumeResponsibility: resp.description,
            similarityScore: similarityScore,
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      similarities,
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
