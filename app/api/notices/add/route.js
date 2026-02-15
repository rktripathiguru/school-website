import db from "@/lib/db";

export async function POST(req) {
  try {
    const { title, description } = await req.json();

    await db.query(
      "INSERT INTO notices (title, description) VALUES (?, ?)",
      [title, description]
    );

    return Response.json({ message: "Notice added successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
