import { DataArray } from '@huggingface/transformers'
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  AlignmentType,
  PageOrientation,
} from 'docx'
import { saveAs } from 'file-saver'

interface Responsibility {
  id: string
  weight: number
  description: string
}

interface Experience {
  id: string
  title: string
  weightedResponsibilities: Responsibility[]
}

interface Education {
  id: string
  field: string
  institution: string
  weight: number
}

export async function generateWordDocument(
  username: string,
  experiences: Experience[],
  educations: Education[]
): Promise<void> {
  // Prepare content for the document
  const children: Paragraph[] = []

  // Add username as H1 with adjusted spacing
  children.push(
    new Paragraph({
      text: username,
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 }, // Adjust spacing below H1
    })
  )

  // Add education section
  children.push(
    new Paragraph({
      text: 'Education',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 }, // Adjust spacing above and below section header
    })
  )

  for (const education of educations) {
    children.push(
      new Paragraph({
        text: `${education.field} - ${education.institution}`,
        spacing: { after: 100 }, // Spacing between entries
      })
    )
  }

  // Add experience section
  children.push(
    new Paragraph({
      text: 'Experience',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 }, // Adjust spacing above and below section header
    })
  )

  const MAX_PAGE_HEIGHT = 8.5 * 72 // Approximate height in points for one page (8.5 inches)
  let currentPageHeight = 0

  for (const experience of experiences) {
    children.push(
      new Paragraph({
        text: experience.title,
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 150, after: 100 }, // Adjust spacing around each experience
      })
    )
    currentPageHeight += 24 // Approximate height of heading

    // Sort responsibilities by weight
    const sortedResponsibilities = experience.weightedResponsibilities.sort(
      (a, b) => b.weight - a.weight
    )

    for (const responsibility of sortedResponsibilities) {
      const paragraph = new Paragraph({
        text: `- ${responsibility.description}`,
        spacing: { after: 100 }, // Spacing between responsibilities
      })
      children.push(paragraph)
      currentPageHeight += 16 // Approximate height of paragraph

      if (currentPageHeight > MAX_PAGE_HEIGHT) {
        break
      }
    }

    if (currentPageHeight > MAX_PAGE_HEIGHT) {
      break
    }
  }

  // Create the document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: { size: { orientation: PageOrientation.PORTRAIT } },
        },
        children,
      },
    ],
  })

  // Generate the document and save it
  const buffer = await Packer.toBuffer(doc)
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })
  saveAs(blob, 'Resume.docx')
}

function dotProduct(vecA: DataArray, vecB: DataArray) {
  let product = 0
  for (let i = 0; i < vecA.length; i++) {
    product += vecA[i] * vecB[i]
  }
  return product
}

function magnitude(vec: DataArray) {
  let sum = 0
  for (let i = 0; i < vec.length; i++) {
    sum += vec[i] * vec[i]
  }
  return Math.sqrt(sum)
}

export function cosineSimilarity(vecA: DataArray, vecB: DataArray) {
  return dotProduct(vecA, vecB) / (magnitude(vecA) * magnitude(vecB))
}
