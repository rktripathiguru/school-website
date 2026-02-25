"use client";

import { useEffect, useState } from "react";

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingRollNo, setEditingRollNo] = useState(null);
  const [tempRollNo, setTempRollNo] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/students/list");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();

      setStudents(data);
      setFiltered(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
      setFiltered([]);
    }
  };

  const handleFilter = (cls) => {
    setSelectedClass(cls);

    if (cls === "All") {
      setFiltered(students);
    } else {
      const filtered = students.filter((s) => s.class === cls);
      setFiltered(filtered);
    }
  };

  const uniqueClasses = ["All", ...new Set(students.filter(s => s.class).map((s) => s.class))];

  const startEditingRollNo = (studentId, currentRollNo) => {
    setEditingRollNo(studentId);
    setTempRollNo(currentRollNo || "");
  };

  const cancelEditingRollNo = () => {
    setEditingRollNo(null);
    setTempRollNo("");
  };

  const saveRollNo = async (studentId) => {
    if (saving) return;
    
    setSaving(true);
    try {
      const student = students.find(s => s.id === studentId);
      const isAdmission = studentId.toString().startsWith("admission-");
      
      const res = await fetch("/api/students/update-roll", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: studentId,
          roll_no: tempRollNo,
          type: isAdmission ? "admission" : "student"
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update roll number");
      }

      // Update local state
      setStudents(prev => prev.map(s => 
        s.id === studentId ? { ...s, roll_no: tempRollNo } : s
      ));
      setFiltered(prev => prev.map(s => 
        s.id === studentId ? { ...s, roll_no: tempRollNo } : s
      ));

      cancelEditingRollNo();
    } catch (error) {
      console.error("Error saving roll number:", error);
      alert("Failed to save roll number: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-3xl font-bold text-blue-700 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Students List
        </h1>
        
        {/* Filter - Corner Style */}
        <div className="flex flex-col items-end">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Filter by Class
          </label>
          <select
            value={selectedClass}
            onChange={(e) => handleFilter(e.target.value)}
            className="w-full md:w-48 border-2 border-blue-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-600 bg-gradient-to-r from-white to-blue-50 shadow-md transition-all hover:shadow-lg text-gray-700 font-medium"
          >
            {uniqueClasses.map((cls, index) => (
              <option key={index} value={cls} className="text-gray-700">
                {cls}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <th className="p-4 text-left font-semibold w-1/5">Name</th>
                <th className="p-4 text-center font-semibold w-1/8">Class</th>
                <th className="p-4 text-center font-semibold w-1/8">Roll No</th>
                <th className="p-4 text-left font-semibold w-1/5">Father</th>
                <th className="p-4 text-center font-semibold w-1/8">Contact</th>
                <th className="p-4 text-center font-semibold w-1/8">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, index) => (
                <tr 
                  key={student.id} 
                  className={`border-b transition-all duration-200 ${
                    index % 2 === 0 
                      ? 'bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-blue-100' 
                      : 'bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-blue-100'
                  }`}
                >
                  <td className="p-4 w-1/5">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      {student.name || "N/A"}
                    </button>
                  </td>
                  <td className="p-4 w-1/8 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {student.class || "N/A"}
                    </span>
                  </td>
                  <td className="p-4 w-1/8 text-center">
                    {editingRollNo === student.id ? (
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="text"
                          value={tempRollNo}
                          onChange={(e) => setTempRollNo(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              saveRollNo(student.id);
                            } else if (e.key === 'Escape') {
                              cancelEditingRollNo();
                            }
                          }}
                          className="w-16 px-2 py-1 text-sm border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-600 text-center font-mono"
                          autoFocus
                          disabled={saving}
                        />
                        <button
                          onClick={() => saveRollNo(student.id)}
                          disabled={saving}
                          className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50"
                          title="Save"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={cancelEditingRollNo}
                          disabled={saving}
                          className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50"
                          title="Cancel"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditingRollNo(student.id, student.roll_no)}
                        className="text-gray-700 font-mono text-sm bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                        title="Click to edit"
                      >
                        {student.roll_no || "N/A"}
                      </button>
                    )}
                  </td>
                  <td className="p-4 w-1/5">
                    <span className="text-gray-700">
                      {student.father_name || "N/A"}
                    </span>
                  </td>
                  <td className="p-4 w-1/8 text-center">
                    <span className="text-gray-700 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {student.contact || "N/A"}
                    </span>
                  </td>
                  <td className="p-4 w-1/8 text-center">
                    {student.status ? (
                      student.status === 'Approved' ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Excel Upload
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-700">
            <div className="text-lg font-semibold text-gray-800">No students found</div>
            <div className="text-sm mt-2 text-gray-600">Try adjusting the filter or add new students</div>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-700 font-medium">
        Showing {filtered.length} of {students.length} students
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Student Details</h2>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedStudent.name || "N/A"}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Application ID</label>
                    <p className="text-lg font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded inline-block">
                      {selectedStudent.application_id || "N/A"}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Class</label>
                    <p className="text-lg text-gray-900">{selectedStudent.class || "N/A"}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Roll Number</label>
                    <p className="text-lg text-gray-900">{selectedStudent.roll_no || "N/A"}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Father's Name</label>
                    <p className="text-lg text-gray-900">{selectedStudent.father_name || "N/A"}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Contact Number</label>
                    <p className="text-lg text-gray-900">{selectedStudent.contact || "N/A"}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Admission Status</label>
                    <div>
                      {selectedStudent.status ? (
                        selectedStudent.status === 'Approved' ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          Excel Upload
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedStudent.created_at && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Registration Date</label>
                  <p className="text-gray-900">
                    {new Date(selectedStudent.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
