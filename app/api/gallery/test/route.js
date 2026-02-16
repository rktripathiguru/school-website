import db from "@/lib/db";

export async function GET() {
  try {
    console.log("=== Gallery Database Test Started ===");
    console.log("🔗 DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");
    
    // Test basic connection
    try {
      console.log("🔌 Testing basic connection...");
      const [testResult] = await db.query("SELECT 1 as test");
      console.log("✅ Basic connection successful");
    } catch (connError) {
      console.error("❌ Basic connection failed:", connError.message);
      return Response.json({ error: "Database connection failed", details: connError.message }, { status: 500 });
    }
    
    // Test table structure
    try {
      console.log("📋 Checking table structure...");
      const [describeResult] = await db.query("DESCRIBE gallery");
      console.log("✅ Table structure:", describeResult);
      return Response.json({ 
        message: "Database test completed",
        connection: "OK",
        table: describeResult,
        test: testResult
      });
    } catch (structError) {
      console.error("❌ Table structure check failed:", structError.message);
      return Response.json({ error: "Table structure check failed", details: structError.message }, { status: 500 });
    }
    
  } catch (error) {
    console.error("❌ Test error:", error.message);
    return Response.json({ error: "Database test failed", details: error.message }, { status: 500 });
  }
}
