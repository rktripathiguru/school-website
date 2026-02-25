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
      
      const result = await db.query(
        "INSERT INTO gallery (title, description, file_path, file_name, file_size, mime_type) VALUES (?, ?, ?, ?, ?, ?)",
        [file.name, '', dataUrl, file.name, file.size, mimeType]
      );
      
      console.log("📝 Query executed:", result);
      console.log("🎯 Insert result:", result);
      console.log("✅ Successfully saved to database");
      
      return Response.json({ 
        message: "Image uploaded successfully to database",
        image_url: dataUrl,
        storage: "database",
        id: result.insertId
      });
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
