import { createClient } from '@supabase/supabase-js'
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Use smaller model that's easier to load
const embeddings = new HuggingFaceTransformersEmbeddings({
  modelName: 'Xenova/all-MiniLM-L6-v2', // Smaller model that works with Xenova
})

export async function storeKnowledge() {
  const { data } = await import('@/app/chat/knowledge')
  const sections = data.split('\n\n').filter(s => s)
  
  for (const section of sections) {
    const embedding = await embeddings.embedQuery(section)
    const title = section.split('\n')[0]
    
    await supabase
      .from('knowledge')
      .insert({
        content: section,
        embedding,
        section_title: title
      })
  }
}

export async function queryKnowledge(input: string, k = 3) {
  try {
    const inputEmbedding = await embeddings.embedQuery(input)
    
    const { data } = await supabase.rpc('match_documents', {
      query_embedding: inputEmbedding,
      match_threshold: 0.5,
      match_count: k
    })

    return data?.map((d: { content: string }) => d.content).join('\n\n') || ''
  } catch (error) {
    console.error('Error querying knowledge:', error)
    return ''
  }
} 