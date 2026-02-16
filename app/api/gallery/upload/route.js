import db from "@/lib/db";

// Fallback storage for when database is unavailable
let fallbackStorage = [];

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

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

    // Try to save to database first
    try {
      await db.query(
        "INSERT INTO gallery (image_url) VALUES (?)",
        [dataUrl]
      );
      
      return Response.json({ 
        message: "Image uploaded successfully to database",
        image_url: dataUrl,
        storage: "database"
      });
    } catch (dbError) {
      console.error("Database error, using fallback storage:", dbError);
      
      // Fallback to in-memory storage
      const imageRecord = {
        id: imageId,
        image_url: dataUrl,
        created_at: new Date().toISOString(),
        storage: "fallback"
      };
      
      fallbackStorage.push(imageRecord);
      
      return Response.json({ 
        message: "Image uploaded successfully (fallback storage)",
        image_url: dataUrl,
        storage: "fallback",
        id: imageId
      });
    }

  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ 
      error: "Upload failed. Please try again." 
    }, { status: 500 });
  }
}
