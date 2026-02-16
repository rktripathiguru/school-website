import db from "@/lib/db";

// Fallback storage for when database is unavailable
let fallbackStorage = [];

export async function GET() {
  try {
    // Try to get images from database first
    const [rows] = await db.query(
      "SELECT * FROM gallery ORDER BY created_at DESC"
    );

    return Response.json(rows);
  } catch (error) {
    console.error("Database error, using fallback storage:", error);
    
    // Return fallback storage images
    return Response.json(fallbackStorage);
  }
}
