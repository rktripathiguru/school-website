import db from "@/lib/db";

export async function POST() {
  try {
    console.log("=== Fixing Gallery Column Size ===");
    
    // Check current column structure
    const [columns] = await db.query("DESCRIBE gallery");
    const imageColumn = columns.find(col => col.Field === 'image_url');
    
    console.log("Current image_url column:", imageColumn);
    
    if (imageColumn && imageColumn.Type.includes('varchar(500)')) {
      console.log("🔧 Increasing image_url column size...");
      
      // Increase column size to handle large base64 images
      await db.query("ALTER TABLE gallery MODIFY COLUMN image_url TEXT");
      console.log("✅ image_url column changed to TEXT type");
      
      return Response.json({ 
        message: "Gallery column fixed successfully",
        old_type: imageColumn.Type,
        new_type: "TEXT"
      });
    } else if (imageColumn && imageColumn.Type === 'text') {
      console.log("✅ image_url column is already TEXT type");
      return Response.json({ 
        message: "Gallery column already has correct size",
        current_type: imageColumn.Type
      });
    } else {
      console.log("❌ image_url column not found or has unexpected type");
      return Response.json({ 
        error: "image_url column not found",
        columns: columns.map(col => ({ field: col.Field, type: col.Type }))
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error("❌ Failed to fix gallery column:", error.message);
    return Response.json({ 
      error: error.message,
      details: error.sqlMessage
    }, { status: 500 });
  }
}
