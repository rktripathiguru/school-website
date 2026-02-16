-- Admissions Table Setup for Railway MySQL
-- Run these commands in your Railway MySQL database

-- Create admissions table (if not exists)
CREATE TABLE IF NOT EXISTS admissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id VARCHAR(50) NOT NULL UNIQUE,
  student_name VARCHAR(255) NOT NULL,
  student_class VARCHAR(50) NOT NULL,
  dob DATE,
  father_name VARCHAR(255),
  mother_name VARCHAR(255),
  address TEXT,
  email VARCHAR(255),
  parent_contact VARCHAR(20),
  aadhar_number VARCHAR(12),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add indexes for better performance (check if they exist first)
-- Note: MySQL doesn't support IF NOT EXISTS with CREATE INDEX
-- These will be created if they don't exist, and will show error if they do exist (which is safe to ignore)

CREATE INDEX idx_admissions_application_id ON admissions(application_id);
CREATE INDEX idx_admissions_status ON admissions(status);
CREATE INDEX idx_admissions_created_at ON admissions(created_at);

-- Check if table exists and show structure
DESCRIBE admissions;

-- Verify table creation
SELECT 'Admissions table created successfully' as status;
