"use client";

import { useState } from "react";

export default function UploadStudents() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select an Excel file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/students/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Students uploaded successfully ✅");
    } else {
      setMessage("Error: " + data.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Upload Students Excel
      </h1>

      <form
        onSubmit={handleUpload}
        className="bg-white p-6 rounded shadow w-full max-w-md"
      >
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload
        </button>

        {message && (
          <p className="mt-4 text-gray-700 font-semibold">{message}</p>
        )}
      </form>
    </div>
  );
}
