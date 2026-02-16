# Admin Admissions Dashboard - Unified View

## Overview
The admin admissions dashboard now displays both individual form submissions and Excel batch uploads in a single, unified view.

## Features Implemented

### ✅ **Unified Data Display**
- Both form submissions and Excel uploads appear in the same table
- Consistent formatting and data structure
- Real-time statistics showing breakdown by source

### ✅ **Enhanced Filtering**
- **All Applications**: Shows both form and Excel data
- **Individual Forms**: Filters to show only form submissions (`data_source = 'form'`)
- **Excel Uploads**: Filters to show only Excel uploads (`data_source = 'excel'`)

### ✅ **Source Identification**
- **Green Badge**: Individual Form submissions
- **Blue Badge**: Excel Upload batches
- **Gray Badge**: Unknown sources

### ✅ **Improved Statistics**
- Total Applications count
- Individual Forms count
- Excel Uploads count
- Pending Review count

### ✅ **Enhanced API Response**
The `/api/admissions/list` endpoint now returns:
```json
{
  "admissions": [...],
  "stats": {
    "total": 150,
    "form_submissions": 120,
    "excel_uploads": 30,
    "pending": 45,
    "approved": 80,
    "rejected": 25
  }
}
```

## Database Schema Integration

### New Columns Utilized:
- `data_source`: 'form' or 'excel'
- `created_at`: Timestamp for sorting
- `batch_id`: Groups Excel uploads (for future features)

### Query Improvements:
```sql
SELECT *, 
  CASE 
    WHEN data_source = 'excel' THEN 'Excel Upload'
    WHEN data_source = 'form' THEN 'Individual Form'
    ELSE 'Unknown'
  END as source_label
FROM admissions 
ORDER BY created_at DESC
```

## Benefits

1. **Single Source of Truth**: All admission data in one view
2. **Easy Data Management**: Filter and search across all sources
3. **Clear Data Lineage**: Always know where data came from
4. **Improved Analytics**: Better statistics and reporting
5. **Consistent User Experience**: Same interface for all data types

## Usage

1. Navigate to `/admin/admissions`
2. Use the filter dropdown to view specific data sources
3. Search by name, application ID, or class
4. View real-time statistics in the dashboard cards
5. Click on any application to view details (future enhancement)

## Future Enhancements

- Batch management features for Excel uploads
- Export functionality for filtered data
- Application detail views
- Bulk status updates
- Advanced filtering options
