import { storeKnowledge } from '@/app/lib/embeddings'

async function main() {
  await storeKnowledge()
  console.log('Knowledge base seeded!')
}

main() 