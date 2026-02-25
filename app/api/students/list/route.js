import db from "@/lib/db";

export async function GET() {
  try {
    // Students uploaded via Excel
    const [students] = await db.query("SELECT * FROM students");
    
    // All admissions (both approved and pending)
    const [allAdmissions] = await db.query(
      "SELECT student_name AS name, student_class AS class, father_name, parent_contact AS contact, status, application_id FROM admissions"
    );

    // Ensure both are arrays, default to empty arrays if undefined
    const studentsArray = Array.isArray(students) ? students : [];
    const admissionsArray = Array.isArray(allAdmissions) ? allAdmissions : [];

    // Normalize admissions data to match students table
    const admissionsMapped = admissionsArray.map((a) => ({
      id: "admission-" + a.application_id, // Use application_id instead of index
      name: a.name,
      class: a.class,
      roll_no: "-",
      father_name: a.father_name,
      contact: a.contact,
      status: a.status || "Pending",
      application_id: a.application_id,
    }));

    // Merge both
    const combined = [...studentsArray, ...admissionsMapped];

    return Response.json(combined);

  } catch (error) {
    console.error("Database error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
