import db from "@/lib/db";

export async function GET() {
  try {
    console.log("=== Admissions List Request Started ===");
    console.log("🔗 DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");
    
    // Test database connection first
    try {
      console.log("🔌 Testing database connection...");
      const [testResult] = await db.query("SELECT 1 as test");
      console.log("✅ Database connection test successful");
    } catch (connError) {
      console.error("❌ Database connection failed:", connError.message);
      return Response.json({ error: "Database connection failed", details: connError.message }, { status: 500 });
    }
    
    // Get all admissions from database
    try {
      console.log("💾 Fetching all admissions...");
      const [rows] = await db.query(
        "SELECT * FROM admissions ORDER BY created_at DESC"
      );
      
      console.log("✅ Admissions query successful, found", rows.length, "records");
      
      // Log sample data for debugging
      if (rows.length > 0) {
        console.log("📊 Sample admissions data:");
        rows.slice(0, 3).forEach((row, index) => {
          console.log(`  ${index + 1}. ID: ${row.id}, App ID: ${row.application_id}, Name: ${row.student_name}, Source: ${row.application_id?.startsWith('BULK') ? 'Bulk' : 'Individual'}`);
        });
      }
      
      return Response.json(rows);
    } catch (dbError) {
      console.error("❌ Database error:", dbError.message);
      console.error("❌ Full error:", dbError);
      return Response.json({ error: "Failed to fetch admissions", details: dbError.message }, { status: 500 });
    }
  } catch (error) {
    console.error("❌ List error:", error.message);
    console.error("❌ Full error:", error);
    return Response.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}
