"use client";
import { useState } from "react";

export default function Admissions() {
  const [applicationIdCheck, setApplicationIdCheck] = useState("");
  const [formData, setFormData] = useState({
    student_name: "",
    student_class: "",
    dob: "",
    gender: "",
    aadhar_number: "",
    father_name: "",
    mother_name: "",
    parent_contact: "",
    email: "",
    address: "",
  });

  const [statusResult, setStatusResult] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.parent_contact.length !== 10) {
      alert("Contact number must be 10 digits.");
      return;
    }

    if (formData.aadhar_number.length !== 12) {
      alert("Aadhar number must be 12 digits.");
      return;
    }

    const res = await fetch("/api/admissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Application submitted successfully!\nYour Application ID: " + data.application_id);
      setFormData({
        student_name: "",
        student_class: "",
        dob: "",
        gender: "",
        aadhar_number: "",
        father_name: "",
        mother_name: "",
        parent_contact: "",
        email: "",
        address: "",
      });
    } else {
      alert("Error: " + data.error);
    }
  };

  const handleCheckStatus = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/admissions/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ application_id: applicationIdCheck }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatusResult(`Application Status: ${data.status}`);
      } else {
        setStatusResult(`Error: ${data.error}`);
      }
    } catch (error) {
      setStatusResult(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-10">
        Admission Form
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-300 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <input name="student_name" placeholder="Student Name" value={formData.student_name} onChange={handleChange} className="p-3 border-2 border-gray-400 rounded-lg text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:outline-none" required />

        <input name="student_class" placeholder="Class" value={formData.student_class} onChange={handleChange} className="p-3 border-2 border-gray-400 rounded-lg text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:outline-none" required />

        <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="p-3 border-2 border-gray-400 rounded-lg text-gray-800 focus:border-blue-500 focus:outline-none" required />

        <select name="gender" value={formData.gender} onChange={handleChange} className="p-3 border-2 border-gray-400 rounded-lg text-gray-800 focus:border-blue-500 focus:outline-none" required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input name="aadhar_number" placeholder="Aadhar Number (12 digits)" value={formData.aadhar_number} onChange={handleChange} maxLength="12" className="p-3 border-2 border-gray-400 rounded-lg text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:outline-none" required />

        <input name="father_name" placeholder="Father Name" value={formData.father_name} onChange={handleChange} className="p-3 border-2 border-gray-400 rounded-lg text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:outline-none" required />

        <input name="mother_name" placeholder="Mother Name" value={formData.mother_name} onChange={handleChange} className="p-3 border-2 border-gray-400 rounded-lg text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:outline-none" required />

        <input name="parent_contact" placeholder="Parent Contact (10 digits)" value={formData.parent_contact} onChange={handleChange} maxLength="10" className="p-3 border-2 border-gray-400 rounded-lg text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:outline-none" required />

        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-3 border-2 border-gray-400 rounded-lg text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:outline-none" required />

        <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="p-3 border-2 border-gray-400 rounded-lg text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:outline-none md:col-span-2" required />

        <button type="submit" className="md:col-span-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
          Submit Application
        </button>
      </form>
      {/* Status Check Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Check Admission Status
        </h2>

        <form
          onSubmit={handleCheckStatus}
          className="bg-white p-8 rounded-xl shadow max-w-md mx-auto"
        >
          <input
            type="text"
            placeholder="Enter Application ID"
            value={applicationIdCheck}
            onChange={(e) => setApplicationIdCheck(e.target.value)}
            className="w-full p-3 border rounded mb-6"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
          >
            Check Status
          </button>
          {statusResult && (
            <div className="mt-6 text-center">
              <span
                className={`px-4 py-2 rounded-full font-semibold text-white ${statusResult.includes("Approved")
                  ? "bg-green-600"
                  : statusResult.includes("Rejected")
                    ? "bg-red-600"
                    : statusResult.includes("Pending")
                      ? "bg-yellow-500"
                      : "bg-gray-600"
                  }`}
              >
                {statusResult}
              </span>
            </div>
          )}
        </form>
      </div>
      {/* Forgot Application ID Section */}
      <div className="mt-12 text-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Forgot your Application ID?
        </h3>

        <p className="text-gray-600">
          Please contact the school office for assistance.
        </p>

        <div className="mt-4 bg-gray-100 inline-block px-6 py-4 rounded-lg shadow">
          <p className="font-semibold text-blue-700">
            📞 Phone: +91-9801037090
          </p>
          <p className="font-semibold text-blue-700 mt-2">
            📧 Email: umsjevari@gmail.com
          </p>
        </div>
      </div>

    </div>
  );
}
