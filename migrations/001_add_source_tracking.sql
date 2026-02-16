-- Add source tracking columns to admissions table
-- This migration enables storing both form submissions and Excel uploads in the same table

ALTER TABLE admissions 
ADD COLUMN data_source VARCHAR(20) DEFAULT 'form' COMMENT 'Source of data: form or excel',
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
ADD COLUMN batch_id VARCHAR(50) NULL COMMENT 'Batch ID for Excel uploads';

-- Add index for better query performance on data_source
CREATE INDEX idx_admissions_data_source ON admissions(data_source);

-- Add index for batch queries
CREATE INDEX idx_admissions_batch_id ON admissions(batch_id);

-- Add index for created_at for time-based queries
CREATE INDEX idx_admissions_created_at ON admissions(created_at);
