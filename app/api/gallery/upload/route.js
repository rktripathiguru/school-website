import db from "@/lib/db";
import { writeFile } from "fs/promises";
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
    const filePath = path.join(uploadDir, file.name);

    await writeFile(filePath, buffer);

    // Save file path in database
    await db.query(
      "INSERT INTO gallery (image_url) VALUES (?)",
      [`/uploads/${file.name}`]
    );

    return Response.json({ message: "Image uploaded successfully" });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
