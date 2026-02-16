import db from "@/lib/db";
import fs from "fs";
import path from "path";
import { galleryStorage } from "@/lib/gallery-storage";

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

    // Try to delete from database first
    try {
      await db.query("DELETE FROM gallery WHERE id = ?", [id]);
      
      return Response.json({ 
        message: "Image deleted successfully from database",
        storage: "database"
      });
    } catch (dbError) {
      console.error("Database error, trying fallback storage:", dbError);
      
      // Try to delete from shared fallback storage
      const deleted = galleryStorage.deleteImage(id);
      
      if (deleted) {
        return Response.json({ 
          message: "Image deleted successfully from fallback storage",
          storage: "fallback"
        });
      } else {
        return Response.json({ 
          error: "Image not found in fallback storage" 
        }, { status: 404 });
      }
    }

  } catch (error) {
    console.error("Delete error:", error);
    return Response.json({ 
      error: "Delete failed. Please try again." 
    }, { status: 500 });
  }
}
