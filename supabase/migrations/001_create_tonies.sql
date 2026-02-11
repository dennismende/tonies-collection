-- Create the tonies table
-- Stores all Tonie figure data for the collection catalog.
CREATE TABLE IF NOT EXISTS tonies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  series TEXT NOT NULL,
  image_url TEXT,
  purchase_date DATE,
  price NUMERIC(10, 2),
  notes TEXT,
  favorite BOOLEAN NOT NULL DEFAULT false,
  track_list TEXT[],
  is_creative_tonie BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for common query patterns
CREATE INDEX idx_tonies_series ON tonies (series);
CREATE INDEX idx_tonies_favorite ON tonies (favorite) WHERE favorite = true;
CREATE INDEX idx_tonies_name ON tonies (name);

-- Auto-update the updated_at timestamp on row changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON tonies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE tonies ENABLE ROW LEVEL SECURITY;

-- Public read access (anon role)
CREATE POLICY "Allow public read access"
  ON tonies
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated write access (admin only)
CREATE POLICY "Allow authenticated insert"
  ON tonies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update"
  ON tonies
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete"
  ON tonies
  FOR DELETE
  TO authenticated
  USING (true);
