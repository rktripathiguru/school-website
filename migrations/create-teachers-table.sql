-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert existing teachers data
INSERT INTO teachers (name, subject, image_url) VALUES
('Mr. Ritesh Tiwari', 'Mathematics Teacher', '/images/teachers/teacher1.jpg'),
('Mrs. Sita Devi', 'Science Teacher', '/images/teachers/teacher2.jpg'),
('Mr. Aman Singh', 'English Teacher', '/images/teachers/teacher3.jpg');
