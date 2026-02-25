import db from "@/lib/db";

export async function PUT(request) {
  try {
    const { id, roll_no, type } = await request.json();

    if (!id || roll_no === undefined) {
      return Response.json({ error: "Student ID and roll number are required" }, { status: 400 });
    }

    let query;
    let params;

    if (type === "admission") {
      // For admission records, we need to update based on application_id
      query = "UPDATE admissions SET roll_no = ? WHERE application_id = ?";
      params = [roll_no, id.replace("admission-", "")];
    } else {
      // For regular students table
      query = "UPDATE students SET roll_no = ? WHERE id = ?";
      params = [roll_no, id];
    }

    const [result] = await db.query(query, params);

    if (result.affectedRows === 0) {
      return Response.json({ error: "Student not found or no changes made" }, { status: 404 });
    }

    return Response.json({ success: true, message: "Roll number updated successfully" });

  } catch (error) {
    console.error("Database error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
