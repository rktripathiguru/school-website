-- Railway MySQL Teachers Table with Image Upload Support
-- Copy and execute this in your Railway MySQL console

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT 'Teacher full name',
    subject VARCHAR(255) NOT NULL COMMENT 'Subject or department',
    email VARCHAR(255) UNIQUE COMMENT 'Teacher email (optional)',
    phone VARCHAR(20) NULL COMMENT 'Teacher phone number (optional)',
    image_data LONGBLOB NULL COMMENT 'Binary image data',
    image_mime_type VARCHAR(100) NULL COMMENT 'MIME type of uploaded image',
    image_filename VARCHAR(255) NULL COMMENT 'Original filename of uploaded image',
    bio TEXT NULL COMMENT 'Teacher biography or description',
    experience_years INT NULL COMMENT 'Years of teaching experience',
    qualification VARCHAR(255) NULL COMMENT 'Highest qualification',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Whether teacher is currently active',
    display_order INT DEFAULT 0 COMMENT 'Order for displaying teachers',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_teachers_active (is_active),
    INDEX idx_teachers_order (display_order),
    INDEX idx_teachers_subject (subject)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample teachers data (without images for now)
INSERT INTO teachers (name, subject, email, phone, bio, experience_years, qualification, display_order) VALUES
('Mr. Ritesh Tiwari', 'Mathematics', 'ritesh.tiwari@umsjevari.edu', '9876543210', 'Experienced mathematics teacher with expertise in algebra and geometry. Passionate about making math accessible to all students.', 15, 'M.Sc. Mathematics', 1),
('Mrs. Sita Devi', 'Science', 'sita.devi@umsjevari.edu', '9876543211', 'Dedicated science teacher specializing in physics and chemistry. Focuses on practical learning and scientific inquiry.', 12, 'M.Sc. Physics', 2),
('Mr. Aman Singh', 'English', 'aman.singh@umsjevari.edu', '9876543212', 'Creative English teacher with strong background in literature and communication skills. Prepares students for competitive exams.', 10, 'M.A. English', 3),
('Mrs. Priya Sharma', 'Computer Science', 'priya.sharma@umsjevari.edu', '9876543213', 'Tech-savvy computer science teacher with expertise in programming and web development. Encourages innovation and problem-solving.', 8, 'B.Tech Computer Science', 4),
('Mr. Rajesh Kumar', 'Social Studies', 'rajesh.kumar@umsjevari.edu', '9876543214', 'Knowledgeable social studies teacher making history and geography engaging through interactive teaching methods.', 20, 'M.A. History', 5);

-- Create a table for teacher achievements/awards (optional)
CREATE TABLE IF NOT EXISTS teacher_achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    INDEX idx_achievements_teacher (teacher_id),
    INDEX idx_achievements_year (year)
);

-- Create a table for teacher subjects (if a teacher teaches multiple subjects)
CREATE TABLE IF NOT EXISTS teacher_subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    subject_name VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    INDEX idx_subjects_teacher (teacher_id),
    UNIQUE KEY unique_teacher_subject (teacher_id, subject_name)
);

-- Query examples for Railway MySQL console:

-- Get all active teachers ordered by display order
SELECT id, name, subject, email, phone, bio, experience_years, qualification, 
       CASE WHEN image_data IS NOT NULL THEN 'Yes' ELSE 'No' END as has_image
FROM teachers 
WHERE is_active = TRUE 
ORDER BY display_order ASC, name ASC;

-- Get teachers by subject
SELECT * FROM teachers WHERE subject = 'Mathematics' AND is_active = TRUE;

-- Search teachers by name
SELECT * FROM teachers WHERE name LIKE '%Ritesh%' AND is_active = TRUE;

-- Get teacher count by subject
SELECT subject, COUNT(*) as count 
FROM teachers 
WHERE is_active = TRUE 
GROUP BY subject 
ORDER BY count DESC;

-- Update teacher information
UPDATE teachers 
SET bio = 'Updated bio text', 
    experience_years = 16 
WHERE id = 1;

-- Add new teacher
INSERT INTO teachers (name, subject, email, phone, bio, experience_years, qualification) 
VALUES ('Mrs. Anita Gupta', 'Hindi', 'anita.gupta@umsjevari.edu', '9876543215', 'Experienced Hindi teacher with deep knowledge of literature and grammar.', 18, 'M.A. Hindi');

-- Update teacher image (binary data will be uploaded via API)
UPDATE teachers 
SET image_data = [binary_data], 
    image_mime_type = 'image/jpeg', 
    image_filename = 'teacher_photo.jpg' 
WHERE id = 1;
