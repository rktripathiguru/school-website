import db from "@/lib/db";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const { id, image_url } = await req.json();

    // Delete image file from uploads folder
    const filePath = path.join(
      process.cwd(),
      "public",
      image_url
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete record from database
    await db.query("DELETE FROM gallery WHERE id = ?", [id]);

    return Response.json({ message: "Image deleted successfully" });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
