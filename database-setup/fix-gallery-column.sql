-- Fix Gallery Table - Increase image_url column size
-- Run this command in your Railway MySQL database

-- Drop existing table (optional - will lose data)
-- DROP TABLE IF EXISTS gallery;

-- Create table with larger image_url column
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_url TEXT NOT NULL,  -- Changed from VARCHAR(500) to TEXT
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  storage_type VARCHAR(50) DEFAULT 'database'
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at);
CREATE INDEX IF NOT EXISTS idx_gallery_storage_type ON gallery(storage_type);

-- Verify table creation
SELECT 'Gallery table with TEXT column created successfully' as status;
