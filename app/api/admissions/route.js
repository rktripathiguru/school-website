import db from "@/lib/db";

function generateApplicationId() {
  // Simple automatic unique ID
  return "APP" + Date.now();
}

export async function POST(req) {
  try {
    const data = await req.json();

    // Generate automatic ID
    const applicationId = generateApplicationId();

    // Insert admission data
    await db.query(
      `INSERT INTO admissions (
        application_id,
        student_name,
        dob,
        gender,
        aadhar_number,
        father_name,
        mother_name,
        address,
        email,
        parent_contact,
        student_class,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        applicationId,
        data.student_name,
        data.dob,
        data.gender,
        data.aadhar_number,
        data.father_name,
        data.mother_name,
        data.address,
        data.email,
        data.parent_contact,
        data.student_class,
        "Pending"
      ]
    );

    return Response.json({
      message: "Admission submitted successfully",
      application_id: applicationId,
    });

  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
