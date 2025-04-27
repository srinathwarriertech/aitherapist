create extension if not exists vector;

create table knowledge (
  id bigserial primary key,
  content text,
  embedding vector(768),
  section_title text
);

create index on knowledge using ivfflat (embedding vector_cosine_ops); 