import db from "@/lib/db";
import XLSX from "xlsx";

function generateApplicationId() {
  return "APP" + Date.now() + Math.random().toString(36).substring(2, 9);
}

function validateStudentData(student) {
  const errors = [];
  
  // Required fields validation
  if (!student.student_name || student.student_name.trim() === '') {
    errors.push('Student name is required');
  }
  
  if (!student.student_class || student.student_class.trim() === '') {
    errors.push('Class is required');
  }
  
  if (!student.dob) {
    errors.push('Date of birth is required');
  }
  
  if (!student.gender || !['Male', 'Female'].includes(student.gender)) {
    errors.push('Valid gender is required');
  }
  
  if (!student.aadhar_number || student.aadhar_number.trim() === '') {
    errors.push('Aadhar number is required');
  } else if (student.aadhar_number.length !== 12) {
    errors.push('Aadhar number must be 12 digits');
  }
  
  if (!student.father_name || student.father_name.trim() === '') {
    errors.push('Father name is required');
  }
  
  if (!student.mother_name || student.mother_name.trim() === '') {
    errors.push('Mother name is required');
  }
  
  if (!student.parent_contact || student.parent_contact.trim() === '') {
    errors.push('Parent contact is required');
  } else if (student.parent_contact.length !== 10) {
    errors.push('Parent contact must be 10 digits');
  }
  
  if (!student.email || student.email.trim() === '') {
    errors.push('Email is required');
  } else if (!student.email.includes('@')) {
    errors.push('Valid email is required');
  }
  
  if (!student.address || student.address.trim() === '') {
    errors.push('Address is required');
  }
  
  return errors;
}

export async function POST(req) {
  try {
    console.log("=== Bulk Admission Upload Started ===");
    
    const data = await req.formData();
    const file = data.get("file");
    
    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Check file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return Response.json({ error: "Please upload an Excel file (.xlsx or .xls)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      console.log("📊 Parsing Excel file...");
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      console.log(`📋 Found ${jsonData.length} student records`);
      
      const results = {
        success: [],
        errors: [],
        total: jsonData.length
      };

      // Process each student
      for (let i = 0; i < jsonData.length; i++) {
        const student = jsonData[i];
        const applicationId = generateApplicationId();
        
        // Validate student data
        const validationErrors = validateStudentData(student);
        
        if (validationErrors.length > 0) {
          results.errors.push({
            row: i + 2, // Excel row number (1-indexed + header)
            data: student,
            errors: validationErrors
          });
        } else {
          try {
            // Insert into database
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
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                applicationId,
                student.student_name,
                student.dob,
                student.gender,
                student.aadhar_number,
                student.father_name,
                student.mother_name,
                student.address,
                student.email,
                student.parent_contact,
                student.student_class,
                "Pending"
              ]
            );
            
            results.success.push({
              row: i + 2,
              applicationId: applicationId,
              data: student
            });
            
            console.log(`✅ Successfully processed student: ${student.student_name}`);
          } catch (dbError) {
            console.error(`❌ Database error for row ${i + 2}:`, dbError);
            results.errors.push({
              row: i + 2,
              data: student,
              errors: [`Database error: ${dbError.message}`]
            });
          }
        }
      }

      // Optionally save to memory (for audit trail)
      const uploadLog = {
        timestamp: new Date().toISOString(),
        totalRecords: jsonData.length,
        successful: results.success.length,
        failed: results.errors.length,
        results: results
      };

      console.log(`📝 Upload completed: ${uploadLog.totalRecords} records, Success: ${uploadLog.successful}, Failed: ${uploadLog.failed}`);

      return Response.json({
        message: `Bulk upload completed. Success: ${results.success.length}, Failed: ${results.errors.length}`,
        results: uploadLog
      });

    } catch (parseError) {
      console.error("❌ Excel parsing error:", parseError);
      return Response.json({ error: `Failed to parse Excel file: ${parseError.message}` }, { status: 500 });
    }

  } catch (error) {
    console.error("❌ Bulk upload error:", error);
    return Response.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
  }
}
