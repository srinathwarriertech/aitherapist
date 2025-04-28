"use server";
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
    try{
        const { data } = await import('@/app/chat/knowledge')
        const sections = data.split('\n\n\n\n').filter(s => s)
        console.log('A:'+JSON.stringify(sections))
        
        for (const section of sections) {
            try{
                const embedding = await embeddings.embedQuery(section)
                const title = section.split('\n')[0]
                console.log('B:'+JSON.stringify(title))
                
                // Insert and immediately select
                const { data: inserted, error } = await supabase
                    .from('knowledge')
                    .insert({
                    content: section,
                    embedding,
                    section_title: title
                    })
                    .select()
                
                if (error) throw error
                console.log(`Inserted section "${title}":`, inserted)

            } catch (sectionError) {
                console.error('Error inserting section:', sectionError)
            }
        }
    // Verify total entries
    const { count } = await supabase
      .from('knowledge')
      .select('*', { count: 'exact' })
      
    console.log(`Total entries in knowledge base: ${count}`)
  } catch (error) {
    console.error('Store knowledge failed:', error)
    throw error
  }
}

export async function queryKnowledge(input: string, k = 3) {
  try {
    const inputEmbedding = await embeddings.embedQuery(input)
    
    const { data } = await supabase.rpc('match_documents_5', {
      query_embedding: inputEmbedding,
      match_threshold: 0.3,
      match_count: 5
    })
    console.log('Data:'+JSON.stringify(data));

    return data?.map((d: { content: string }) => d.content).join('\n\n') || ''
  } catch (error) {
    console.error('Error querying knowledge:', error)
    return ''
  }
} 