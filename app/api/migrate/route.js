import db from "@/lib/db";

export async function POST() {
  try {
    console.log("Adding roll_no columns to database tables...");
    
    // Add roll_no column to admissions table
    let admissionsResult = { success: true, message: "" };
    try {
      await db.query("ALTER TABLE admissions ADD COLUMN roll_no VARCHAR(20) DEFAULT NULL");
      admissionsResult.message = "✅ Added roll_no column to admissions table";
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        admissionsResult.message = "ℹ️ roll_no column already exists in admissions table";
      } else {
        admissionsResult.success = false;
        admissionsResult.message = `❌ Failed to add roll_no to admissions: ${error.message}`;
      }
    }
    
    // Add roll_no column to students table
    let studentsResult = { success: true, message: "" };
    try {
      await db.query("ALTER TABLE students ADD COLUMN roll_no VARCHAR(20) DEFAULT NULL");
      studentsResult.message = "✅ Added roll_no column to students table";
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        studentsResult.message = "ℹ️ roll_no column already exists in students table";
      } else {
        studentsResult.success = false;
        studentsResult.message = `❌ Failed to add roll_no to students: ${error.message}`;
      }
    }
    
    // Add indexes
    let indexResults = [];
    try {
      await db.query("CREATE INDEX idx_admissions_roll_no ON admissions(roll_no)");
      indexResults.push("✅ Added index to admissions.roll_no");
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        indexResults.push("ℹ️ Index already exists on admissions.roll_no");
      } else {
        indexResults.push(`⚠️ Could not create index on admissions.roll_no: ${error.message}`);
      }
    }
    
    try {
      await db.query("CREATE INDEX idx_students_roll_no ON students(roll_no)");
      indexResults.push("✅ Added index to students.roll_no");
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        indexResults.push("ℹ️ Index already exists on students.roll_no");
      } else {
        indexResults.push(`⚠️ Could not create index on students.roll_no: ${error.message}`);
      }
    }
    
    // Verify the columns exist
    const [admissionsDesc] = await db.query("SHOW COLUMNS FROM admissions WHERE Field = 'roll_no'");
    const [studentsDesc] = await db.query("SHOW COLUMNS FROM students WHERE Field = 'roll_no'");
    
    const response = {
      success: admissionsResult.success && studentsResult.success,
      admissions: admissionsResult,
      students: studentsResult,
      indexes: indexResults,
      verification: {
        admissions_has_roll_no: admissionsDesc.length > 0,
        students_has_roll_no: studentsDesc.length > 0
      }
    };
    
    return Response.json(response);
    
  } catch (error) {
    console.error("Migration failed:", error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
