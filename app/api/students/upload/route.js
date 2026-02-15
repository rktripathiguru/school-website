import db from "@/lib/db";
import * as XLSX from "xlsx";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    const buffer = Buffer.from(await file.arrayBuffer());

    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    for (const row of rows) {
      await db.query(
        `INSERT INTO students (name, class, roll_no, father_name, contact)
         VALUES (?, ?, ?, ?, ?)`,
        [
          row.name,
          row.class,
          row.roll_no,
          row.father_name,
          row.contact,
        ]
      );
    }

    return Response.json({ message: "Students uploaded successfully" });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
