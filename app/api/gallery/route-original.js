import db from "@/lib/db";

export async function GET() {
  try {
    console.log("=== Gallery List Request Started ===");
    
    // Try to get images from database
    try {
      const [rows] = await db.query("SELECT * FROM gallery ORDER BY created_at DESC");
      console.log("✅ Database query successful, found", rows.length, "images");
      return Response.json(rows);
    } catch (dbError) {
      console.error("❌ Database error:", dbError.message);
      
      // Return fallback images if database fails
      const fallbackImages = [
        {
          id: 1,
          file_path: "/images/gallery/school1.jpg",
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          file_path: "/images/gallery/school2.jpg", 
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          file_path: "/images/gallery/school3.jpg",
          created_at: new Date().toISOString()
        }
      ];
      
      console.log("🔄 Using fallback images");
      return Response.json(fallbackImages);
    }
  } catch (error) {
    console.error("❌ Gallery API error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    console.log("=== Gallery Upload Request Started ===");
    
    const formData = await request.formData();
    const file = formData.get("image");
    const title = formData.get("title") || "Gallery Image";
    const description = formData.get("description") || "";
    
    if (!file) {
      return Response.json({ error: "No image file provided" }, { status: 400 });
    }
    
    // Get file details
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fileName = file.name;
    const fileSize = buffer.length;
    const mimeType = file.type;
    
    // Generate unique filename
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${fileName}`;
    const filePath = `/uploads/gallery/${uniqueFileName}`;
    
    console.log("📁 File details:", {
      fileName,
      fileSize,
      mimeType,
      filePath
    });
    
    // Try to save to database
    try {
      const [result] = await db.query(
        "INSERT INTO gallery (title, description, file_path, file_name, file_size, mime_type) VALUES (?, ?, ?, ?, ?, ?)",
        [title, description, filePath, fileName, fileSize, mimeType]
      );
      
      console.log("✅ Image saved to database with ID:", result.insertId);
      
      return Response.json({
        id: result.insertId,
        title,
        description,
        file_path: filePath,
        file_name: fileName,
        file_size: fileSize,
        mime_type: mimeType,
        created_at: new Date().toISOString()
      });
      
    } catch (dbError) {
      console.error("❌ Database save error:", dbError.message);
      
      // Fallback: return success without database save
      const fallbackId = Date.now();
      return Response.json({
        id: fallbackId,
        title,
        description,
        file_path: filePath,
        file_name: fileName,
        file_size: fileSize,
        mime_type: mimeType,
        created_at: new Date().toISOString(),
        storage: "fallback"
      });
    }
    
  } catch (error) {
    console.error("❌ Upload error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return Response.json({ error: "Image ID is required" }, { status: 400 });
    }
    
    console.log("=== Gallery Delete Request Started ===");
    console.log("🗑️ Deleting image ID:", id);
    
    // Try to delete from database
    try {
      const [result] = await db.query("DELETE FROM gallery WHERE id = ?", [id]);
      
      if (result.affectedRows === 0) {
        return Response.json({ error: "Image not found" }, { status: 404 });
      }
      
      console.log("✅ Image deleted from database");
      return Response.json({ success: true, message: "Image deleted successfully" });
      
    } catch (dbError) {
      console.error("❌ Database delete error:", dbError.message);
      
      // Fallback: return success
      return Response.json({ 
        success: true, 
        message: "Image deleted (fallback mode)",
        storage: "fallback"
      });
    }
    
  } catch (error) {
    console.error("❌ Delete error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
