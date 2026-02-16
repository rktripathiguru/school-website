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
    
    // Get all admissions from database with unified schema
    try {
      console.log("💾 Fetching all admissions...");
      const [rows] = await db.query(
        `SELECT *, 
         CASE 
           WHEN data_source = 'excel' THEN 'Excel Upload'
           WHEN data_source = 'form' THEN 'Individual Form'
           ELSE 'Unknown'
         END as source_label
         FROM admissions 
         ORDER BY created_at DESC`
      );
      
      console.log("✅ Admissions query successful, found", rows.length, "records");
      
      // Log sample data for debugging
      if (rows.length > 0) {
        console.log("📊 Sample admissions data:");
        rows.slice(0, 3).forEach((row, index) => {
          console.log(`  ${index + 1}. ID: ${row.id}, App ID: ${row.application_id}, Name: ${row.student_name}, Source: ${row.data_source} (${row.source_label})`);
        });
      }
      
      // Add statistics for the admin dashboard
      const stats = {
        total: rows.length,
        form_submissions: rows.filter(row => row.data_source === 'form').length,
        excel_uploads: rows.filter(row => row.data_source === 'excel').length,
        pending: rows.filter(row => row.status === 'pending').length,
        approved: rows.filter(row => row.status === 'approved').length,
        rejected: rows.filter(row => row.status === 'rejected').length
      };
      
      return Response.json({
        admissions: rows,
        stats: stats
      });
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
