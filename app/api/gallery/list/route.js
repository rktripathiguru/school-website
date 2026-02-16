import db from "@/lib/db";
import { galleryStorage } from "@/lib/gallery-storage";

export async function GET() {
  try {
    console.log("=== Gallery List Request Started ===");
    
    // Try to get images from database first
    try {
      console.log("💾 Attempting database query...");
      const [rows] = await db.query(
        "SELECT * FROM gallery ORDER BY created_at DESC"
      );
      
      console.log("✅ Database query successful, found", rows.length, "images");
      return Response.json(rows);
    } catch (dbError) {
      console.error("❌ Database error:", dbError.message);
      console.log("🔄 Using fallback storage...");
      
      // Return shared fallback storage images
      const fallbackImages = galleryStorage.getImages();
      console.log("✅ Fallback storage has", fallbackImages.length, "images");
      
      return Response.json(fallbackImages);
    }
  } catch (error) {
    console.error("❌ List error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
