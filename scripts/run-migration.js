import db from "../lib/db.js";

async function runMigration() {
  try {
    console.log("Running migration: Add source tracking columns...");
    
    // Add data_source column
    await db.query(`
      ALTER TABLE admissions 
      ADD COLUMN IF NOT EXISTS data_source VARCHAR(20) DEFAULT 'form'
    `);
    
    // Add created_at column
    await db.query(`
      ALTER TABLE admissions 
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
    
    // Add batch_id column
    await db.query(`
      ALTER TABLE admissions 
      ADD COLUMN IF NOT EXISTS batch_id VARCHAR(50) NULL
    `);
    
    // Add indexes for performance
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_admissions_data_source ON admissions(data_source)
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_admissions_batch_id ON admissions(batch_id)
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_admissions_created_at ON admissions(created_at)
    `);
    
    console.log("Migration completed successfully!");
    console.log("Database is now ready for unified data storage.");
    
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exit(1);
  }
}

runMigration();
