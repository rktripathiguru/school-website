import db from "../lib/db.js";

async function addRollNoColumns() {
  try {
    console.log("Adding roll_no columns to database tables...");
    
    // Add roll_no column to admissions table
    try {
      await db.query("ALTER TABLE admissions ADD COLUMN roll_no VARCHAR(20) DEFAULT NULL");
      console.log("✅ Added roll_no column to admissions table");
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log("ℹ️ roll_no column already exists in admissions table");
      } else {
        throw error;
      }
    }
    
    // Add roll_no column to students table
    try {
      await db.query("ALTER TABLE students ADD COLUMN roll_no VARCHAR(20) DEFAULT NULL");
      console.log("✅ Added roll_no column to students table");
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log("ℹ️ roll_no column already exists in students table");
      } else {
        throw error;
      }
    }
    
    // Add indexes
    try {
      await db.query("CREATE INDEX idx_admissions_roll_no ON admissions(roll_no)");
      console.log("✅ Added index to admissions.roll_no");
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log("ℹ️ Index already exists on admissions.roll_no");
      } else {
        console.log("⚠️ Could not create index on admissions.roll_no:", error.message);
      }
    }
    
    try {
      await db.query("CREATE INDEX idx_students_roll_no ON students(roll_no)");
      console.log("✅ Added index to students.roll_no");
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log("ℹ️ Index already exists on students.roll_no");
      } else {
        console.log("⚠️ Could not create index on students.roll_no:", error.message);
      }
    }
    
    console.log("🎉 Database migration completed successfully!");
    
    // Verify the columns exist
    const [admissionsDesc] = await db.query("DESCRIBE admissions");
    const [studentsDesc] = await db.query("DESCRIBE students");
    
    console.log("\n📋 Admissions table structure:");
    admissionsDesc.forEach(col => {
      if (col.Field === 'roll_no') {
        console.log(`  ✅ ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'}`);
      }
    });
    
    console.log("\n📋 Students table structure:");
    studentsDesc.forEach(col => {
      if (col.Field === 'roll_no') {
        console.log(`  ✅ ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'}`);
      }
    });
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

addRollNoColumns();
