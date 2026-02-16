import db from "@/lib/db";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const { id, image_url } = await req.json();

    // Check if image_url is a base64 data URL or a file path
    if (!image_url.startsWith('data:')) {
      // It's a file path, try to delete the physical file
      const filePath = path.join(
        process.cwd(),
        "public",
        image_url
      );

      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (fileError) {
          console.error("Failed to delete file:", fileError);
          // Continue anyway - file might not exist or be inaccessible
        }
      }
    }
    // If it's a base64 data URL, no file to delete

    // Delete record from database
    try {
      await db.query("DELETE FROM gallery WHERE id = ?", [id]);
    } catch (dbError) {
      console.error("Database error:", dbError);
      return Response.json({ 
        error: "Failed to delete image from database. Database connection may be unavailable." 
      }, { status: 500 });
    }

    return Response.json({ message: "Image deleted successfully" });

  } catch (error) {
    console.error("Delete error:", error);
    return Response.json({ 
      error: "Delete failed. Please try again." 
    }, { status: 500 });
  }
}
