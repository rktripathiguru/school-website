-- Create admin table for authentication
-- This table stores admin login credentials

CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_admin_username (username),
    INDEX idx_admin_email (email),
    INDEX idx_admin_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (change these credentials)
-- Default: username = 'admin', password = 'admin123'
INSERT INTO admin (username, password, email, full_name, role) 
VALUES ('admin', 'admin123', 'admin@umsjevari.edu', 'System Administrator', 'admin')
ON DUPLICATE KEY UPDATE password = VALUES(password);

-- Query examples for admin management:

-- Change admin password
UPDATE admin SET password = 'newpassword123' WHERE username = 'admin';

-- Add new admin user
INSERT INTO admin (username, password, email, full_name, role) 
VALUES ('newadmin', 'newpassword123', 'newadmin@umsjevari.edu', 'New Admin', 'admin');

-- View all admin users
SELECT id, username, email, full_name, role, is_active, last_login, created_at 
FROM admin 
ORDER BY created_at DESC;

-- Deactivate admin user
UPDATE admin SET is_active = FALSE WHERE username = 'oldadmin';

-- Update last login time (handled by login API)
UPDATE admin SET last_login = CURRENT_TIMESTAMP WHERE username = 'admin';
