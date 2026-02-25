"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [notices, setNotices] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");

    if (!isLoggedIn) {
      router.push("/admin");
    } else {
      setCheckingAuth(false);
      fetchNotices();
      fetchAdmissions();
    }
  }, []);


  const fetchNotices = async () => {
    try {
      const res = await fetch("/api/notices");
      if (!res.ok) throw new Error("Failed to fetch notices");
      const data = await res.json();
      setNotices(data);
    } catch (error) {
      console.error("Error fetching notices:", error);
      setNotices([]);
    }
  };

  const fetchAdmissions = async () => {
    try {
      const res = await fetch("/api/admissions/list");
      if (!res.ok) throw new Error("Failed to fetch admissions");
      const data = await res.json();
      setAdmissions(data.admissions || data);
    } catch (error) {
      console.error("Error fetching admissions:", error);
      setAdmissions([]);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Delete this notice?");
    if (!confirmDelete) return;

    try {
      const res = await fetch("/api/notices/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete notice");
      fetchNotices();
    } catch (error) {
      console.error("Error deleting notice:", error);
      alert("Failed to delete notice. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    router.push("/admin");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-48 bg-blue-700 text-white p-6">
        <h2 className="text-2xl font-bold mb-10">Admin Panel</h2>

        <ul className="space-y-4">
          <li className="hover:bg-blue-600 p-2 rounded cursor-pointer">
            Dashboard
          </li>
          <li
            onClick={() => router.push("/admin/students")}
            className="hover:bg-blue-600 p-2 rounded cursor-pointer"
          >
            Upload Students
          </li>
          <li
            onClick={() => router.push("/admin/students/list")}
            className="hover:bg-blue-600 p-2 rounded cursor-pointer"
          >
            Students List
          </li>
          <li
            onClick={() => router.push("/admin/add-notice")}
            className="hover:bg-blue-600 p-2 rounded cursor-pointer"
          >
            Add Notice
          </li>
          <li
            onClick={() => router.push("/admin/gallery")}
            className="hover:bg-blue-600 p-2 rounded cursor-pointer"
          >
            Gallery
          </li>
          <li
            onClick={handleLogout}
            className="hover:bg-red-600 p-2 rounded cursor-pointer"
          >
            Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 bg-gray-400">

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Dashboard Overview
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">Total Notices</h3>
            <p className="text-3xl font-bold text-blue-700">
              {notices.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">Total Admissions</h3>
            <p className="text-3xl font-bold text-green-600">
              {admissions.length}
            </p>
          </div>
        </div>

        {/* Notices Section */}
        <h2 className="text-2xl font-bold mb-4 text-gray-700">
          Manage Notices
        </h2>

        <div className="space-y-4 mb-12">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="bg-white p-6 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold text-blue-700">
                  {notice.title}
                </h3>
                <p className="text-gray-600">{notice.description}</p>
              </div>

              <button
                onClick={() => handleDelete(notice.id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Admissions Section */}
        <h2 className="text-2xl font-bold mb-4 text-gray-700">
          Admission Applications
        </h2>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3">App ID</th>
                <th className="p-3">Student</th>
                <th className="p-3">Class</th>
                <th className="p-3">DOB</th>
                <th className="p-3">Gender</th>
                <th className="p-3">Aadhar</th>
                <th className="p-3">Father</th>
                <th className="p-3">Mother</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Email</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {admissions.map((app) => (
                <tr key={app.id} className="border-b">
                  <td className="p-3 font-semibold text-blue-700">
                    {app.application_id}
                  </td>

                  <td className="p-3">{app.student_name}</td>
                  <td className="p-3">{app.student_class}</td>
                  <td className="p-3">{app.dob}</td>
                  <td className="p-3">{app.gender}</td>

                  <td className="p-3">
                    {app.aadhar_number
                      ? "XXXXXXXX" + app.aadhar_number.slice(-4)
                      : "N/A"}
                  </td>

                  <td className="p-3">{app.father_name}</td>
                  <td className="p-3">{app.mother_name}</td>
                  <td className="p-3">{app.parent_contact}</td>
                  <td className="p-3">{app.email}</td>

                  <td className="p-3">
                    <select
                      value={app.status}
                      onChange={async (e) => {
                        try {
                          const res = await fetch("/api/admissions/update", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              id: app.id,
                              status: e.target.value,
                            }),
                          });
                          if (!res.ok) throw new Error("Failed to update status");
                          fetchAdmissions();
                        } catch (error) {
                          console.error("Error updating admission status:", error);
                          alert("Failed to update status. Please try again.");
                        }
                      }}
                      className="border p-1 rounded"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>

                  <td className="p-3">
                    <button
                      onClick={async () => {
                        const confirmDelete = confirm("Delete this application?");
                        if (!confirmDelete) return;

                        try {
                          const res = await fetch("/api/admissions/delete", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: app.id }),
                          });
                          if (!res.ok) throw new Error("Failed to delete application");
                          fetchAdmissions();
                        } catch (error) {
                          console.error("Error deleting application:", error);
                          alert("Failed to delete application. Please try again.");
                        }
                      }}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

