-- Create the tonies-images storage bucket
-- Public read for serving images, authenticated write for admin uploads.
INSERT INTO storage.buckets (id, name, public)
VALUES ('tonies-images', 'tonies-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to the bucket
CREATE POLICY "Allow public read on tonies-images"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'tonies-images');

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated upload on tonies-images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'tonies-images');

-- Allow authenticated users to update/replace images
CREATE POLICY "Allow authenticated update on tonies-images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'tonies-images');

-- Allow authenticated users to delete images
CREATE POLICY "Allow authenticated delete on tonies-images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'tonies-images');
