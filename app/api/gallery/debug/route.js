import db from "@/lib/db";

export async function GET() {
  try {
    console.log("=== Gallery Debug Info ===");
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      database_url: process.env.DATABASE_URL ? "Set" : "Not set",
      database_url_length: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0,
      node_env: process.env.NODE_ENV || "development"
    };
    
    // Test database connection
    try {
      console.log("🔌 Testing database connection...");
      const [testResult] = await db.query("SELECT 1 as test");
      debugInfo.database_connection = "✅ Connected";
      debugInfo.database_test = testResult[0];
    } catch (connError) {
      debugInfo.database_connection = "❌ Failed";
      debugInfo.connection_error = connError.message;
      console.error("❌ Database connection failed:", connError.message);
    }
    
    // Check if gallery table exists
    try {
      console.log("📋 Checking gallery table...");
      const [tableCheck] = await db.query("SHOW TABLES LIKE 'gallery'");
      debugInfo.table_exists = tableCheck.length > 0;
      
      if (tableCheck.length > 0) {
        // Get table structure
        const [columns] = await db.query("DESCRIBE gallery");
        debugInfo.table_columns = columns.map(col => ({
          field: col.Field,
          type: col.Type,
          null: col.Null,
          key: col.Key
        }));
        
        // Get row count
        const [countResult] = await db.query("SELECT COUNT(*) as count FROM gallery");
        debugInfo.row_count = countResult[0].count;
        
        // Get sample data
        if (debugInfo.row_count > 0) {
          const [sampleData] = await db.query("SELECT id, title, file_name, created_at FROM gallery ORDER BY created_at DESC LIMIT 3");
          debugInfo.sample_data = sampleData;
        }
      }
    } catch (tableError) {
      debugInfo.table_error = tableError.message;
      console.error("❌ Table check failed:", tableError.message);
    }
    
    console.log("🔍 Debug info:", JSON.stringify(debugInfo, null, 2));
    
    return Response.json(debugInfo);
    
  } catch (error) {
    console.error("❌ Debug endpoint error:", error.message);
    return Response.json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
