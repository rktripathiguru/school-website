import db from "@/lib/db";

export async function POST(req) {
  try {
    const { id } = await req.json();

    await db.query("DELETE FROM notices WHERE id = ?", [id]);

    return Response.json({ message: "Notice deleted successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
