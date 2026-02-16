"use client";

import { useState } from "react";

export default function BulkAdmissions() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls'))) {
      setFile(selectedFile);
      setResult(null);
    } else {
      setFile(null);
      setResult('Please select an Excel file (.xlsx or .xls)');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
      setFile(droppedFile);
      setResult(null);
    } else {
      setFile(null);
      setResult('Please select an Excel file (.xlsx or .xls)');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setResult('Please select a file to upload');
      return;
    }

    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admissions/bulk', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(`✅ Success! ${data.message}`);
        setFile(null);
      } else {
        setResult(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Create a simple CSV template for download
    const template = [
      'student_name,student_class,dob,gender,aadhar_number,father_name,mother_name,parent_contact,email,address',
      'John Doe,10,2010-01-15,Male,123456789012,Ram Kumar,9876543210,john.doe@example.com,123 Main Street, City',
      'Jane Smith,9,2010-03-20,Female,987654321098,Sita Devi,8765432109,jane.smith@example.com,456 Oak Avenue, Town'
    ].join('\n');

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'admission_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          Bulk Student Admissions
        </h1>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Upload Excel File
          </h2>

          {/* File Input Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            
            <div className="space-y-4">
              {file ? (
                <div className="flex items-center justify-center">
                  <svg className="w-12 h-12 text-green-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3 9 9v6m0 6h6m-6 9 9v6m9-21l9-9-9-9h18a9 9 0 0118 0v-6a9 9 0 00-9-9H9a9 9 0 00-9 9z" />
                  </svg>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-gray-700">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="ml-4 text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-4 4v8a4 4 0 008 8zm0 12h8m-4-4H8a4 4 0 00-4-4v8a4 4 0 008 8z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-700">
                    Drag and drop your Excel file here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports .xlsx and .xls files
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => document.getElementById('file-input').click()}
              className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Choose File
            </button>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
          >
            {uploading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Uploading and Processing...
              </div>
            ) : (
              'Upload Excel File'
            )}
          </button>

          {/* Result Message */}
          {result && (
            <div className={`mt-4 p-4 rounded-lg ${
              result.includes('✅') ? 'bg-green-50 border-green-200 text-green-800' : 
              result.includes('❌') ? 'bg-red-50 border-red-200 text-red-800' : 
              'bg-yellow-50 border-yellow-200 text-yellow-800'
            }`}>
              <p className="font-medium">{result}</p>
            </div>
          )}
        </div>

        {/* Instructions Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Instructions & Template
          </h2>

          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">📊 Excel File Format:</h3>
              <p>Your Excel file should contain the following columns in this exact order:</p>
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                <p>student_name | student_class | dob | gender | aadhar_number | father_name | mother_name | parent_contact | email | address</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">📋 Required Fields:</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>student_name:</strong> Full name of the student</li>
                <li><strong>student_class:</strong> Class/grade (e.g., "10", "9-A")</li>
                <li><strong>dob:</strong> Date of birth (YYYY-MM-DD format)</li>
                <li><strong>gender:</strong> "Male" or "Female"</li>
                <li><strong>aadhar_number:</strong> 12-digit Aadhar number</li>
                <li><strong>father_name:</strong> Father's full name</li>
                <li><strong>mother_name:</strong> Mother's full name</li>
                <li><strong>parent_contact:</strong> 10-digit phone number</li>
                <li><strong>email:</strong> Valid email address</li>
                <li><strong>address:</strong> Complete residential address</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">💡 Tips:</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Ensure all required fields are filled for each student</li>
                <li>Use valid date format (YYYY-MM-DD)</li>
                <li>Aadhar numbers must be exactly 12 digits</li>
                <li>Phone numbers must be exactly 10 digits</li>
                <li>Email addresses must contain "@" symbol</li>
                <li>Remove any empty rows from your Excel file</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">📥 Download Template:</h3>
              <p className="mb-4">Download a template CSV file to get started with the correct format:</p>
              <button
                onClick={downloadTemplate}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-medium"
              >
                Download CSV Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
