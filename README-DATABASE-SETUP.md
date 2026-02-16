# Database Setup for Unified Admission Storage

## Overview
Your MySQL database is now configured to store both application form submissions and Excel batch uploads in the same `admissions` table with consistent formatting.

## Database Schema Changes

### New Columns Added:
- `data_source` VARCHAR(20) - Tracks if data came from 'form' or 'excel'
- `created_at` TIMESTAMP - Auto-generated timestamp for each record
- `batch_id` VARCHAR(50) - Groups Excel uploads together (NULL for form submissions)

### Updated API Features

#### Form Submission (Existing)
```javascript
POST /api/admissions
{
  "student_name": "John Doe",
  "student_class": "10",
  "dob": "2005-01-15",
  "gender": "Male",
  "aadhar_number": "123456789012",
  "father_name": "Father Name",
  "mother_name": "Mother Name",
  "parent_contact": "9876543210",
  "email": "john@example.com",
  "address": "123 Street, City"
}
```

#### Excel Batch Upload (New)
```javascript
POST /api/admissions
{
  "batch": true,
  "students": [
    {
      "student_name": "Jane Smith",
      "student_class": "9",
      "dob": "2006-05-20",
      "gender": "Female",
      "aadhar_number": "987654321098",
      "father_name": "Father Name",
      "mother_name": "Mother Name",
      "parent_contact": "9876543211",
      "email": "jane@example.com",
      "address": "456 Avenue, City"
    }
  ]
}
```

## Migration Instructions

### Option 1: Run Migration Script (Recommended)
```bash
node scripts/run-migration.cjs
```

### Option 2: Manual SQL Execution
Execute these SQL commands in your MySQL database:

```sql
-- Add tracking columns
ALTER TABLE admissions 
ADD COLUMN data_source VARCHAR(20) DEFAULT 'form',
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN batch_id VARCHAR(50) NULL;

-- Add performance indexes
CREATE INDEX idx_admissions_data_source ON admissions(data_source);
CREATE INDEX idx_admissions_batch_id ON admissions(batch_id);
CREATE INDEX idx_admissions_created_at ON admissions(created_at);
```

## Query Examples

### Get All Students
```sql
SELECT * FROM admissions ORDER BY created_at DESC;
```

### Get Only Form Submissions
```sql
SELECT * FROM admissions WHERE data_source = 'form';
```

### Get Only Excel Uploads
```sql
SELECT * FROM admissions WHERE data_source = 'excel';
```

### Get Specific Batch
```sql
SELECT * FROM admissions WHERE batch_id = 'BATCH1234567890';
```

### Count by Source
```sql
SELECT data_source, COUNT(*) as count 
FROM admissions 
GROUP BY data_source;
```

## Benefits

1. **Unified Storage**: All student data in one table
2. **Data Lineage**: Track source of each record
3. **Batch Tracking**: Group Excel uploads with batch IDs
4. **Consistent Format**: Same schema for both data types
5. **Easy Reporting**: Single source for all admission data

## Next Steps

1. Run the migration script to update your database
2. Test both form submission and Excel upload functionality
3. Update any existing frontend code to handle batch uploads
4. Consider adding admin interface to view/manage both data types
