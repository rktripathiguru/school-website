-- Add roll_no columns to tables that don't have them
-- Run this migration to support editable roll numbers

-- Add roll_no column to admissions table if it doesn't exist
ALTER TABLE admissions 
ADD COLUMN IF NOT EXISTS roll_no VARCHAR(20) DEFAULT NULL;

-- Add roll_no column to students table if it doesn't exist  
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS roll_no VARCHAR(20) DEFAULT NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_admissions_roll_no ON admissions(roll_no);
CREATE INDEX IF NOT EXISTS idx_students_roll_no ON students(roll_no);

-- Verify the columns were added
DESCRIBE admissions;
DESCRIBE students;

SELECT 'Roll number columns added successfully' as status;
