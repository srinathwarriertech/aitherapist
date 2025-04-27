const { createClient } = require('@supabase/supabase-js');
const { HuggingFaceTransformersEmbeddings } = require('@langchain/community/embeddings/hf_transformers');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Import knowledge data
const knowledgeData = require('../app/chat/knowledge').data;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const embeddings = new HuggingFaceTransformersEmbeddings({
  modelName: 'Xenova/all-MiniLM-L6-v2',
});

async function storeKnowledge() {
  console.log('Splitting knowledge into sections...');
  const sections = knowledgeData.split('\n\n').filter(s => s.trim());
  
  console.log(`Found ${sections.length} sections to embed`);
  
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    console.log(`Processing section ${i+1}/${sections.length}`);
    
    try {
      const embedding = await embeddings.embedQuery(section);
      const title = section.split('\n')[0].trim();
      
      const { data, error } = await supabase
        .from('knowledge')
        .insert({
          content: section,
          embedding,
          section_title: title
        });
        
      if (error) {
        console.error(`Error inserting section ${i+1}:`, error);
      } else {
        console.log(`Section ${i+1} embedded and stored successfully`);
      }
    } catch (error) {
      console.error(`Error embedding section ${i+1}:`, error);
    }
    
    // Wait a bit between embeddings to avoid rate limiting
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log('Knowledge base seeding complete!');
}

storeKnowledge()
  .catch(console.error); 