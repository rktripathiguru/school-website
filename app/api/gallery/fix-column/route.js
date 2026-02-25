import db from "@/lib/db";

export async function POST() {
  try {
    console.log("=== Fixing Gallery Column Size ===");
    
    // Check current column structure
    const [columns] = await db.query("DESCRIBE gallery");
    const imageColumn = columns.find(col => col.Field === 'image_url');
    
    console.log("Current image_url column:", imageColumn);
    
    if (!imageColumn) {
      return Response.json({ 
        error: "image_url column not found",
        columns: columns.map(col => ({ field: col.Field, type: col.Type }))
      }, { status: 400 });
    }
    
    // Always try to modify to LONGTEXT to ensure it can handle large images
    console.log("🔧 Ensuring image_url column can handle large data...");
    
    try {
      await db.query("ALTER TABLE gallery MODIFY COLUMN image_url LONGTEXT");
      console.log("✅ image_url column changed to LONGTEXT type");
      
      return Response.json({ 
        message: "Gallery column fixed successfully to LONGTEXT",
        old_type: imageColumn.Type,
        new_type: "LONGTEXT"
      });
    } catch (alterError) {
      console.error("❌ ALTER TABLE failed:", alterError.message);
      
      // If LONGTEXT fails, try TEXT
      if (!imageColumn.Type.includes('text')) {
        try {
          await db.query("ALTER TABLE gallery MODIFY COLUMN image_url TEXT");
          console.log("✅ image_url column changed to TEXT type");
          
          return Response.json({ 
            message: "Gallery column fixed successfully to TEXT",
            old_type: imageColumn.Type,
            new_type: "TEXT"
          });
        } catch (textError) {
          console.error("❌ TEXT also failed:", textError.message);
          return Response.json({ 
            error: "Failed to modify column to both LONGTEXT and TEXT",
            alter_error: alterError.message,
            text_error: textError.message
          }, { status: 500 });
        }
      } else {
        return Response.json({ 
          error: "Column is already text-based but ALTER failed",
          current_type: imageColumn.Type,
          alter_error: alterError.message
        }, { status: 500 });
      }
    }
    
  } catch (error) {
    console.error("❌ Failed to fix gallery column:", error.message);
    return Response.json({ 
      error: error.message,
      details: error.sqlMessage
    }, { status: 500 });
  }
}
