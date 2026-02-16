const pool = require("../lib/db.cjs");

async function runMigration() {
  let connection;
  try {
    console.log("Running migration: Add source tracking columns...");
    
    connection = await pool.getConnection();
    
    // Check if columns already exist
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'school_db' AND TABLE_NAME = 'admissions'
    `);
    
    const columnNames = columns.map(col => col.COLUMN_NAME);
    
    // Add data_source column if not exists
    if (!columnNames.includes('data_source')) {
      console.log("Adding data_source column...");
      await connection.execute(`
        ALTER TABLE admissions 
        ADD COLUMN data_source VARCHAR(20) DEFAULT 'form'
      `);
    }
    
    // Add created_at column if not exists
    if (!columnNames.includes('created_at')) {
      console.log("Adding created_at column...");
      await connection.execute(`
        ALTER TABLE admissions 
        ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
    }
    
    // Add batch_id column if not exists
    if (!columnNames.includes('batch_id')) {
      console.log("Adding batch_id column...");
      await connection.execute(`
        ALTER TABLE admissions 
        ADD COLUMN batch_id VARCHAR(50) NULL
      `);
    }
    
    console.log("Migration completed successfully!");
    console.log("Database is now ready for unified data storage.");
    
  } catch (error) {
    console.error("Migration failed:", error);
    console.error("Full error details:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

runMigration();
