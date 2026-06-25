-- Supabase Storage bucket setup for media uploads
-- Run this in Supabase Dashboard SQL Editor

-- Create the media bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'video/mp4', 'video/webm', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read files
CREATE POLICY "Public can read media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

-- Allow authenticated/anonymous uploads (via service role key from server)
CREATE POLICY "Admin can insert media"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'media');

-- Allow authenticated deletes (via service role key from server)
CREATE POLICY "Admin can delete media"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'media');
