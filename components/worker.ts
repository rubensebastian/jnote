import { pipeline, env } from '@huggingface/transformers'
import { PipelineType } from '@huggingface/transformers'

env.allowLocalModels = false

class PipelineSingleton {
  static task: PipelineType = 'embeddings'
  static model = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
  static instance: PipelineSingleton | null = null

  static async getInstance(progress_callback = undefined) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback })
    }
    return this.instance
  }
}
