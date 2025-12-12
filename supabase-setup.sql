-- Run this SQL in your Supabase SQL Editor to set up the database

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create uploads table
CREATE TABLE IF NOT EXISTS uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

-- Create policies for comments (allow all operations)
CREATE POLICY "Allow public read access on comments"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on comments"
  ON comments FOR INSERT
  WITH CHECK (true);

-- Create policies for uploads (allow all operations)
CREATE POLICY "Allow public read access on uploads"
  ON uploads FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on uploads"
  ON uploads FOR INSERT
  WITH CHECK (true);

-- Create storage bucket for wedding media
INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-media', 'wedding-media', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Allow public upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'wedding-media');

CREATE POLICY "Allow public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'wedding-media');

CREATE POLICY "Allow public download"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'wedding-media');
