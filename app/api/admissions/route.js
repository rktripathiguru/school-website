import db from "@/lib/db";

function generateApplicationId(prefix = "APP") {
  return prefix + Date.now() + Math.floor(Math.random() * 1000);
}

export async function POST(req) {
  try {
    const data = await req.json();
    const isBatchUpload = data.batch === true;
    
    // Handle single form submission
    if (!isBatchUpload) {
      const applicationId = generateApplicationId("FORM");
      
      await db.query(
        `INSERT INTO admissions (
          application_id, student_name, dob, gender, aadhar_number,
          father_name, mother_name, address, email, parent_contact,
          student_class, status, data_source
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          "Pending",
          "form"
        ]
      );
      
      return Response.json({
        message: "Admission submitted successfully",
        application_id: applicationId,
      });
    }
    
    // Handle batch Excel upload
    const batchId = generateApplicationId("BATCH");
    const results = [];
    
    for (const student of data.students) {
      const applicationId = generateApplicationId("EXCEL");
      
      await db.query(
        `INSERT INTO admissions (
          application_id, student_name, dob, gender, aadhar_number,
          father_name, mother_name, address, email, parent_contact,
          student_class, status, data_source, batch_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          applicationId,
          student.student_name || student.name || '',
          student.dob || '',
          student.gender || '',
          student.aadhar_number || student.aadhar || '',
          student.father_name || student.father || '',
          student.mother_name || student.mother || '',
          student.address || '',
          student.email || '',
          student.parent_contact || student.contact || student.phone || '',
          student.student_class || student.class || student.grade || '',
          "Pending",
          "excel",
          batchId
        ]
      );
      
      results.push({ application_id: applicationId, status: "success" });
    }
    
    return Response.json({
      message: "Batch upload completed successfully",
      batch_id: batchId,
      results: results,
      total_processed: data.students.length
    });
    
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
