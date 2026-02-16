import db from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads");
    
    // Create upload directory if it doesn't exist
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (mkdirError) {
      console.error("Failed to create upload directory:", mkdirError);
      // Continue anyway - directory might already exist
    }

    const filePath = path.join(uploadDir, file.name);

    try {
      await writeFile(filePath, buffer);
    } catch (writeError) {
      console.error("Failed to write file:", writeError);
      return Response.json({ 
        error: "Failed to save file. File system may not be available on this platform." 
      }, { status: 500 });
    }

    // Save file path in database
    try {
      await db.query(
        "INSERT INTO gallery (image_url) VALUES (?)",
        [`/uploads/${file.name}`]
      );
    } catch (dbError) {
      console.error("Database error:", dbError);
      return Response.json({ 
        error: "File uploaded but failed to save to database. Database connection may be unavailable." 
      }, { status: 500 });
    }

    return Response.json({ message: "Image uploaded successfully" });

  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ 
      error: "Upload failed. This may be due to file system limitations on the hosting platform." 
    }, { status: 500 });
  }
}
