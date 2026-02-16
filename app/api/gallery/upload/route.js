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
      await db.query(
        "INSERT INTO gallery (image_url) VALUES (?)",
        [dataUrl]
      );
      
      console.log("✅ Successfully saved to database");
      return Response.json({ 
        message: "Image uploaded successfully to database",
        image_url: dataUrl,
        storage: "database",
        id: imageId
      });
    } catch (dbError) {
      console.error("❌ Database error:", dbError.message);
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
        id: imageRecord.id
      });
    }

  } catch (error) {
    console.error("❌ Upload error:", error.message);
    return Response.json({ 
      error: "Upload failed. Please try again." 
    }, { status: 500 });
  }
}
