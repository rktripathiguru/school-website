import db from "@/lib/db";

export async function GET() {
  try {
    console.log("=== Teachers List Request Started ===");
    
    try {
      console.log("💾 Attempting database query...");
      const [rows] = await db.query("SELECT * FROM teachers ORDER BY name ASC");
      
      console.log("✅ Database query successful, found", rows.length, "teachers");
      return Response.json(rows);
    } catch (dbError) {
      console.error("❌ Database error:", dbError.message);
      console.log("🔄 Returning fallback teachers...");
      
      // Return fallback teachers if database fails
      const fallbackTeachers = [
        {
          id: 1,
          name: "Mr. Ritesh Tiwari",
          subject: "Mathematics Teacher",
          image_url: "/images/teachers/teacher1.jpg"
        },
        {
          id: 2,
          name: "Mrs. Sita Devi",
          subject: "Science Teacher",
          image_url: "/images/teachers/teacher2.jpg"
        },
        {
          id: 3,
          name: "Mr. Aman Singh",
          subject: "English Teacher",
          image_url: "/images/teachers/teacher3.jpg"
        }
      ];
      
      console.log("✅ Returning", fallbackTeachers.length, "fallback teachers");
      return Response.json(fallbackTeachers);
    }
  } catch (error) {
    console.error("❌ Teachers API error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, subject, image_url } = await request.json();
    
    if (!name || !subject) {
      return Response.json({ error: "Name and subject are required" }, { status: 400 });
    }

    console.log("=== Add Teacher Request Started ===");
    console.log("Teacher data:", { name, subject, image_url });

    try {
      const [result] = await db.query(
        "INSERT INTO teachers (name, subject, image_url) VALUES (?, ?, ?)",
        [name, subject, image_url || null]
      );

      console.log("✅ Teacher added successfully with ID:", result.insertId);
      return Response.json({ 
        id: result.insertId, 
        name, 
        subject, 
        image_url,
        message: "Teacher added successfully" 
      });
    } catch (dbError) {
      console.error("❌ Database error:", dbError.message);
      return Response.json({ error: "Failed to add teacher to database" }, { status: 500 });
    }
  } catch (error) {
    console.error("❌ Add Teacher API error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, name, subject, image_url } = await request.json();
    
    if (!id || !name || !subject) {
      return Response.json({ error: "ID, name and subject are required" }, { status: 400 });
    }

    console.log("=== Update Teacher Request Started ===");
    console.log("Teacher data:", { id, name, subject, image_url });

    try {
      const [result] = await db.query(
        "UPDATE teachers SET name = ?, subject = ?, image_url = ? WHERE id = ?",
        [name, subject, image_url || null, id]
      );

      if (result.affectedRows === 0) {
        return Response.json({ error: "Teacher not found" }, { status: 404 });
      }

      console.log("✅ Teacher updated successfully");
      return Response.json({ 
        id, 
        name, 
        subject, 
        image_url,
        message: "Teacher updated successfully" 
      });
    } catch (dbError) {
      console.error("❌ Database error:", dbError.message);
      return Response.json({ error: "Failed to update teacher in database" }, { status: 500 });
    }
  } catch (error) {
    console.error("❌ Update Teacher API error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return Response.json({ error: "Teacher ID is required" }, { status: 400 });
    }

    console.log("=== Delete Teacher Request Started ===");
    console.log("Teacher ID:", id);

    try {
      const [result] = await db.query("DELETE FROM teachers WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        return Response.json({ error: "Teacher not found" }, { status: 404 });
      }

      console.log("✅ Teacher deleted successfully");
      return Response.json({ message: "Teacher deleted successfully" });
    } catch (dbError) {
      console.error("❌ Database error:", dbError.message);
      return Response.json({ error: "Failed to delete teacher from database" }, { status: 500 });
    }
  } catch (error) {
    console.error("❌ Delete Teacher API error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
