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
      
      // Check if gallery table exists and get its structure
      const [tableCheck] = await db.query("SHOW TABLES LIKE 'gallery'");
      console.log("📋 Gallery table exists:", tableCheck.length > 0 ? "Yes" : "No");
      
      if (tableCheck.length === 0) {
        console.log("❌ Gallery table doesn't exist - creating it...");
        
        // Create the gallery table
        const createTableSQL = `
          CREATE TABLE gallery (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            file_path VARCHAR(500) NOT NULL,
            file_name VARCHAR(255) NOT NULL,
            file_size INT NOT NULL,
            mime_type VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `;
        
        await db.query(createTableSQL);
        console.log("✅ Gallery table created successfully!");
        
        // Add index
        await db.query("CREATE INDEX idx_gallery_created_at ON gallery(created_at)");
        console.log("✅ Index created successfully!");
        
        // Return empty array for new table
        return Response.json([]);
      } else {
        console.log("📋 Gallery table exists, checking structure...");
        
        // Check table structure
        const [columns] = await db.query("DESCRIBE gallery");
        const hasImageUrl = columns.some(col => col.Field === 'image_url');
        const hasFilePath = columns.some(col => col.Field === 'file_path');
        
        console.log("📊 Table has image_url:", hasImageUrl, "file_path:", hasFilePath);
        
        let [rows] = await db.query("SELECT * FROM gallery ORDER BY created_at DESC");
        
        // Normalize data to have both fields for compatibility
        rows = rows.map(row => {
          if (hasImageUrl && !hasFilePath) {
            // Old structure - add file_path from image_url
            return { ...row, file_path: row.image_url };
          } else if (hasFilePath && !hasImageUrl) {
            // New structure - add image_url from file_path
            return { ...row, image_url: row.file_path };
          }
          // Both fields exist or neither - return as-is
          return row;
        });
        
        console.log("✅ Database query successful, found", rows.length, "images");
        console.log("📊 Sample data:", JSON.stringify(rows.slice(0, 2), null, 2));
        
        return Response.json(rows);
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
