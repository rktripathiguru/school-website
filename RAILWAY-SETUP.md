# Railway MySQL Teachers Table Setup

## 🚀 Quick Setup Guide

### Step 1: Access Railway MySQL Console
1. Go to your [Railway Dashboard](https://railway.app)
2. Click on your MySQL service
3. Click on "MySQL" tab
4. Click "Open MySQL Console" or "Query" button

### Step 2: Create Teachers Table
Copy and paste this SQL into the Railway MySQL console:

```sql
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
```

### Step 3: Insert Sample Data
Run this SQL to add sample teachers:

```sql
-- Insert sample teachers data
INSERT INTO teachers (name, subject, email, phone, bio, experience_years, qualification, display_order) VALUES
('Mr. Ritesh Tiwari', 'Mathematics', 'ritesh.tiwari@umsjevari.edu', '9876543210', 'Experienced mathematics teacher with expertise in algebra and geometry.', 15, 'M.Sc. Mathematics', 1),
('Mrs. Sita Devi', 'Science', 'sita.devi@umsjevari.edu', '9876543211', 'Dedicated science teacher specializing in physics and chemistry.', 12, 'M.Sc. Physics', 2),
('Mr. Aman Singh', 'English', 'aman.singh@umsjevari.edu', '9876543212', 'Creative English teacher with strong background in literature.', 10, 'M.A. English', 3);
```

### Step 4: Verify Table Creation
Run this query to confirm:

```sql
-- Check if table was created
SHOW TABLES LIKE 'teachers';

-- Verify data
SELECT id, name, subject, email, phone, bio, experience_years, qualification, is_active, display_order 
FROM teachers 
ORDER BY display_order ASC;
```

---

## 🔧 Environment Setup

### Update your Railway Environment Variables:
1. In Railway dashboard, go to your service
2. Click "Variables" tab
3. Add/Update `DATABASE_URL` with your MySQL connection string

Format:
```
mysql://username:password@host:port/database_name
```

### Example:
```
mysql://root:password@containers-us-west-XXX.railway.app:7913/railway
```

---

## ✅ Test the Setup

### 1. Restart Your Application
```bash
# In your project directory
npm run dev
```

### 2. Test API Endpoints
- **GET** `/api/teachers` - Should return teacher list
- **POST** `/api/teachers` - Should add new teacher
- **PUT** `/api/teachers` - Should update teacher
- **DELETE** `/api/teachers` - Should delete teacher

### 3. Test Admin Interface
1. Go to `/admin/teachers`
2. Try adding a new teacher
3. Upload an image
4. Verify success message

---

## 🐛 Troubleshooting

### If you get "Table doesn't exist" error:
1. Double-check SQL was executed in Railway console
2. Verify table name is exactly `teachers`
3. Check for any SQL syntax errors

### If you get connection error:
1. Verify `DATABASE_URL` environment variable
2. Check Railway MySQL service is running
3. Ensure firewall allows connection

### If image upload fails:
1. Verify `image_data` column is LONGBLOB type
2. Check file size limits
3. Verify API is receiving FormData

---

## 📱 Expected Results

After setup, you should see:
- ✅ Teachers list on `/about` page
- ✅ Working admin form at `/admin/teachers`
- ✅ Image upload functionality
- ✅ No more 500 errors
- ✅ Teacher data persists in Railway MySQL

---

## 🎯 Next Steps

1. **Run the SQL** in Railway MySQL console
2. **Update environment variables** if needed
3. **Restart your application**
4. **Test teacher management**

The teachers table will be ready for full functionality!
