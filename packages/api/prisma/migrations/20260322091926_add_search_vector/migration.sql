-- Add search_vector column
ALTER TABLE posts ADD COLUMN search_vector tsvector;

-- Create GIN index
CREATE INDEX posts_search_idx ON posts USING GIN (search_vector);

-- Create trigger function to auto-update search_vector
CREATE OR REPLACE FUNCTION posts_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', coalesce(NEW.title, '') || ' ' || coalesce(NEW.content, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER posts_search_vector_trigger
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION posts_search_vector_update();

-- Backfill existing rows
UPDATE posts SET search_vector = to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, ''));
