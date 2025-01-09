import { DataArray } from '@huggingface/transformers'

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
