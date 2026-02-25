import db from "@/lib/db";
import { galleryStorage } from "@/lib/gallery-storage";

export async function POST(req) {
  try {
    console.log("=== Gallery Upload Started ===");
    
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      console.log("❌ No file uploaded");
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("📁 File received:", file.name, file.type, file.size);

    // Convert file to base64 for storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');
    
    // Determine file type from file name
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const mimeType = file.type || `image/${fileExtension}`;
    
    // Create data URL for direct embedding
    const dataUrl = `data:${mimeType};base64,${base64Data}`;
    
    // Generate unique ID
    const imageId = Date.now() + Math.random().toString(36).substr(2, 9);
    console.log("🆔 Generated image ID:", imageId);

    // Try to save to database first
    try {
      console.log("💾 Attempting database save...");
      console.log("📊 Image URL length:", dataUrl.length);
      console.log("🔗 DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");
      
      // Test database connection first
      const [testResult] = await db.query("SELECT 1 as test");
      console.log("✅ Database connection test successful");
      
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
        
        // Use new table structure
        const result = await db.query(
          "INSERT INTO gallery (title, description, file_path, file_name, file_size, mime_type) VALUES (?, ?, ?, ?, ?, ?)",
          [file.name, '', dataUrl, file.name, file.size, mimeType]
        );
        
        console.log("📝 Query executed:", result);
        console.log("✅ Successfully saved to database (new structure)");
        
        return Response.json({ 
          message: "Image uploaded successfully to database",
          image_url: dataUrl,
          storage: "database",
          id: result.insertId
        });
      } else {
        console.log("📋 Gallery table exists, checking structure...");
        
        // Check table structure
        const [columns] = await db.query("DESCRIBE gallery");
        const hasImageUrl = columns.some(col => col.Field === 'image_url');
        const hasFilePath = columns.some(col => col.Field === 'file_path');
        
        console.log("📊 Table has image_url:", hasImageUrl, "file_path:", hasFilePath);
        
        let result;
        if (hasFilePath) {
          // New table structure
          result = await db.query(
            "INSERT INTO gallery (title, description, file_path, file_name, file_size, mime_type) VALUES (?, ?, ?, ?, ?, ?)",
            [file.name, '', dataUrl, file.name, file.size, mimeType]
          );
          console.log("✅ Successfully saved to database (new structure)");
        } else {
          // Old table structure
          result = await db.query(
            "INSERT INTO gallery (image_url, created_at, storage_type) VALUES (?, ?, ?)",
            [dataUrl, new Date().toISOString(), 'database']
          );
          console.log("✅ Successfully saved to database (old structure)");
        }
        
        console.log("📝 Query executed:", result);
        
        return Response.json({ 
          message: "Image uploaded successfully to database",
          image_url: dataUrl,
          storage: "database",
          id: result.insertId
        });
      }
    } catch (dbError) {
      console.error("❌ Database error details:", {
        message: dbError.message,
        code: dbError.code,
        errno: dbError.errno,
        sql: dbError.sql,
        sqlMessage: dbError.sqlMessage
      });
      console.log("🔄 Using fallback storage...");
      
      // Fallback to shared storage
      const imageRecord = galleryStorage.addImage({
        id: imageId,
        image_url: dataUrl,
        created_at: new Date().toISOString()
      });
      
      console.log("✅ Saved to fallback storage, total images:", galleryStorage.getStorageCount());
      
      return Response.json({ 
        message: "Image uploaded successfully (fallback storage)",
        image_url: dataUrl,
        storage: "fallback",
        id: imageRecord.id,
        databaseError: dbError.message
      });
    }

  } catch (error) {
    console.error("❌ Upload error:", error.message);
    return Response.json({ 
      error: "Upload failed. Please try again." 
    }, { status: 500 });
  }
}
