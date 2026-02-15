import db from "@/lib/db";

export async function POST(req) {
  try {
    const { application_id } = await req.json();

    const [rows] = await db.query(
      "SELECT status FROM admissions WHERE application_id = ?",
      [application_id]
    );

    if (rows.length === 0) {
      return Response.json(
        { error: "Invalid Application ID" },
        { status: 404 }
      );
    }

    return Response.json({ status: rows[0].status });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
