"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TeachersManagement() {
  const [teachers, setTeachers] = useState([]);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    subject: "", 
    email: "", 
    phone: "", 
    image: null, 
    bio: "", 
    experience_years: "", 
    qualification: "",
    display_order: "0"
  });
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      router.push("/admin");
    } else {
      fetchTeachers();
    }
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/teachers");
      if (!res.ok) throw new Error("Failed to fetch teachers");
      const data = await res.json();
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setTeachers([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          formDataToSend.append('image', formData[key]);
        } else if (key !== 'image') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add ID if editing
      if (editingTeacher) {
        formDataToSend.append('id', editingTeacher.id);
      }

      const url = "/api/teachers";
      const method = editingTeacher ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!res.ok) throw new Error("Failed to save teacher");
      
      fetchTeachers();
      resetForm();
      alert(editingTeacher ? "Teacher updated successfully!" : "Teacher added successfully!");
    } catch (error) {
      console.error("Error saving teacher:", error);
      alert("Failed to save teacher. Please try again.");
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name || "",
      subject: teacher.subject || "",
      email: teacher.email || "",
      phone: teacher.phone || "",
      image: null, // Don't pre-load image for editing
      bio: teacher.bio || "",
      experience_years: teacher.experience_years?.toString() || "",
      qualification: teacher.qualification || "",
      display_order: teacher.display_order?.toString() || "0"
    });
    setIsAdding(false);
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Delete this teacher?");
    if (!confirmDelete) return;

    try {
      const res = await fetch("/api/teachers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete teacher");
      fetchTeachers();
    } catch (error) {
      console.error("Error deleting teacher:", error);
      alert("Failed to delete teacher. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: "", 
      subject: "", 
      email: "", 
      phone: "", 
      image: null, 
      bio: "", 
      experience_years: "", 
      qualification: "",
      display_order: "0"
    });
    setEditingTeacher(null);
    setIsAdding(false);
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
          <li
            onClick={() => router.push("/admin/dashboard")}
            className="hover:bg-blue-600 p-2 rounded cursor-pointer"
          >
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
          <li className="bg-blue-600 p-2 rounded cursor-pointer">
            Teachers
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
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Teachers Management
        </h1>

        {/* Add/Edit Teacher Form */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Teacher Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Subject *"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Experience Years (optional)"
                value={formData.experience_years}
                onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              <input
                type="text"
                placeholder="Qualification (optional)"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Display Order (0 = first)"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher Photo (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.image && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected: {formData.image.name} ({(formData.image.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <textarea
                placeholder="Teacher Bio (optional)"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                {editingTeacher ? "Update Teacher" : "Add Teacher"}
              </button>
              {editingTeacher && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Teachers List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Current Teachers</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">Subject</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">Phone</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">Experience</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">Image</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{teacher.name}</td>
                    <td className="p-4 text-gray-600">{teacher.subject}</td>
                    <td className="p-4 text-gray-600 text-sm">{teacher.email || '-'}</td>
                    <td className="p-4 text-gray-600 text-sm">{teacher.phone || '-'}</td>
                    <td className="p-4 text-gray-600 text-sm">{teacher.experience_years ? `${teacher.experience_years} years` : '-'}</td>
                    <td className="p-4">
                      {teacher.image_url ? (
                        <img
                          src={teacher.image_url}
                          alt={teacher.name}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = "/images/teachers/default.jpg";
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(teacher)}
                          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(teacher.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {teachers.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No teachers found. Add your first teacher above.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
