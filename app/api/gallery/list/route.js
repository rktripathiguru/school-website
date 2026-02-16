import db from "@/lib/db";
import { galleryStorage } from "@/lib/gallery-storage";

export async function GET() {
  try {
    console.log("=== Gallery List Request Started ===");
    console.log("🔗 DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");
    
    // Test database connection first
    try {
      console.log("🔌 Testing database connection...");
      const [testResult] = await db.query("SELECT 1 as test");
      console.log("✅ Database connection test successful");
    } catch (connError) {
      console.error("❌ Database connection failed:", connError.message);
    }
    
    // Try to get images from database first
    try {
      console.log("💾 Attempting database query...");
      const [rows] = await db.query(
        "SELECT * FROM gallery ORDER BY created_at DESC"
      );
      
      console.log("✅ Database query successful, found", rows.length, "images");
      console.log("📊 Sample data:", JSON.stringify(rows.slice(0, 2), null, 2));
      
      // If we got data from database, return it
      if (rows && rows.length > 0) {
        console.log("🎯 Returning database images");
        return Response.json(rows);
      } else {
        console.log("⚠️ Database returned empty, checking if table exists...");
        
        // Check if table exists
        const [tableCheck] = await db.query("SHOW TABLES LIKE 'gallery'");
        console.log("📋 Gallery table exists:", tableCheck.length > 0 ? "Yes" : "No");
        
        if (tableCheck.length === 0) {
          console.log("❌ Gallery table doesn't exist - need to run SQL setup");
        }
        
        // Return fallback storage
        console.log("🔄 Using fallback storage...");
        const fallbackImages = galleryStorage.getImages();
        console.log("✅ Fallback storage has", fallbackImages.length, "images");
        return Response.json(fallbackImages);
      }
    } catch (dbError) {
      console.error("❌ Database error:", dbError.message);
      console.error("❌ Full error:", dbError);
      console.log("🔄 Using fallback storage...");
      
      // Return shared fallback storage images
      const fallbackImages = galleryStorage.getImages();
      console.log("✅ Fallback storage has", fallbackImages.length, "images");
      
      return Response.json(fallbackImages);
    }
  } catch (error) {
    console.error("❌ List error:", error.message);
    console.error("❌ Full error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
