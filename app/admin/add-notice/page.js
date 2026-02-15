"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddNotice() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/notices/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });

    if (res.ok) {
      alert("Notice added successfully!");
      router.push("/admin/dashboard");
    } else {
      alert("Error adding notice");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-purple-600 to-blue-600 p-10 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Add Notice
        </h2>

        <input
          type="text"
          placeholder="Notice Title"
          className="w-full p-3 border border-white/30 rounded mb-4 bg-white text-gray-800 placeholder-gray-600"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Notice Description"
          className="w-full p-3 border border-white/30 rounded mb-6 bg-white text-gray-800 placeholder-gray-600"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>

        <button
          type="submit"
          className="w-full bg-white text-purple-700 py-3 rounded hover:bg-white/90 transition font-semibold"
        >
          Add Notice
        </button>
      </form>
    </div>
  );
}
