-- The same four jobs in PostgreSQL with the pgvector extension.
-- Read this file; the lab itself runs without a database.

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE chunks (
  id        text PRIMARY KEY,
  source    text NOT NULL,
  title     text,
  body      text NOT NULL,
  embedding vector(1024) NOT NULL   -- must match the size of your embedding model
);

-- Approximate nearest-neighbour index (needed once you have many thousands of rows).
CREATE INDEX chunks_embedding_idx ON chunks USING hnsw (embedding vector_cosine_ops);

-- upsert
INSERT INTO chunks (id, source, title, body, embedding)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (id) DO UPDATE SET body = EXCLUDED.body, embedding = EXCLUDED.embedding;

-- query: <=> is cosine DISTANCE, so similarity = 1 - distance
SELECT id, source, body, 1 - (embedding <=> $1) AS score
FROM chunks
WHERE source = $2            -- the metadata filter
ORDER BY embedding <=> $1
LIMIT 4;
