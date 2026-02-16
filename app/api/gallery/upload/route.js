import db from "@/lib/db";

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to base64 for storage in database
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');
    
    // Determine file type from file name
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const mimeType = file.type || `image/${fileExtension}`;
    
    // Create data URL for direct embedding
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    // Save to database as base64 data URL
    try {
      await db.query(
        "INSERT INTO gallery (image_url) VALUES (?)",
        [dataUrl]
      );
    } catch (dbError) {
      console.error("Database error:", dbError);
      return Response.json({ 
        error: "Failed to save image to database. Database connection may be unavailable." 
      }, { status: 500 });
    }

    return Response.json({ 
      message: "Image uploaded successfully",
      image_url: dataUrl
    });

  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ 
      error: "Upload failed. Please try again." 
    }, { status: 500 });
  }
}
