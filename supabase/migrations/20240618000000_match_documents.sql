-- Enable pgvector extension
create extension if not exists vector;

-- Create knowledge table if it doesn't exist
create table if not exists knowledge (
  id bigserial primary key,
  content text,
  embedding vector(384),  -- Dimension for all-MiniLM-L6-v2 is 384
  section_title text
);

-- Create index for faster similarity search
create index if not exists knowledge_embedding_idx on knowledge using ivfflat (embedding vector_cosine_ops);

-- Create function to match documents
create or replace function match_documents(
  query_embedding vector(384),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    k.id,
    k.content,
    1 - (k.embedding <=> query_embedding) as similarity
  from knowledge k
  where 1 - (k.embedding <=> query_embedding) > match_threshold
  order by k.embedding <=> query_embedding
  limit match_count;
end;
$$; 