import db from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const teacherId = params.id;
    
    if (!teacherId) {
      return Response.json({ error: "Teacher ID is required" }, { status: 400 });
    }

    console.log("=== Teacher Image Request Started ===");
    console.log("Teacher ID:", teacherId);

    try {
      const [rows] = await db.query(
        "SELECT image_data, image_mime_type, image_filename FROM teachers WHERE id = ? AND image_data IS NOT NULL",
        [teacherId]
      );

      if (rows.length === 0 || !rows[0].image_data) {
        return Response.json({ error: "Image not found" }, { status: 404 });
      }

      const teacher = rows[0];
      const imageBuffer = Buffer.from(teacher.image_data);
      
      return new Response(imageBuffer, {
        headers: {
          'Content-Type': teacher.image_mime_type || 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
          'Content-Disposition': `inline; filename="${teacher.image_filename || 'teacher-image.jpg'}"`
        }
      });

    } catch (dbError) {
      console.error("❌ Database error:", dbError.message);
      return Response.json({ error: "Failed to fetch image from database" }, { status: 500 });
    }
  } catch (error) {
    console.error("❌ Teacher Image API error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
