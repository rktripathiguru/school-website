-- Gallery Table Setup for Railway MySQL
-- Run these commands in your Railway MySQL database

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  storage_type VARCHAR(50) DEFAULT 'database'
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at);
CREATE INDEX IF NOT EXISTS idx_gallery_storage_type ON gallery(storage_type);

-- Insert sample data (optional)
INSERT INTO gallery (image_url, created_at, storage_type) VALUES 
('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop', NOW(), 'database'),
('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop', DATE_SUB(NOW(), INTERVAL 1 DAY), 'database'),
('https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop', DATE_SUB(NOW(), INTERVAL 2 DAY), 'database');

-- Verify table creation
SELECT 'Gallery table created successfully' as status;
