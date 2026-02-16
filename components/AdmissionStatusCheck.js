"use client";

import { useState } from "react";

export default function AdmissionStatusCheck() {
  const [applicationIdCheck, setApplicationIdCheck] = useState("");
  const [statusResult, setStatusResult] = useState("");

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
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-blue-700 mb-4 text-center">
        Check Admission Status
      </h3>

      <form
        onSubmit={handleCheckStatus}
        className="space-y-4"
      >
        <input
          type="text"
          placeholder="Enter Application ID"
          value={applicationIdCheck}
          onChange={(e) => setApplicationIdCheck(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
        >
          Check Status
        </button>

        {statusResult && (
          <div className="mt-4 text-center">
            <span
              className={`inline-block px-4 py-2 rounded-full font-semibold text-white text-sm ${statusResult.includes("Approved")
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

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-2">
          Forgot your Application ID?
        </p>

        <div className="bg-gray-50 inline-block px-4 py-3 rounded-lg border">
          <p className="font-semibold text-blue-700 text-sm">
            📞 Phone: +91-9801037090
          </p>
          <p className="font-semibold text-blue-700 text-sm mt-1">
            📧 Email: umsjevari@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}
