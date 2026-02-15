"use client";

import { useEffect, useState } from "react";

export default function AdminGallery() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const res = await fetch("/api/gallery/list");
    const data = await res.json();
    setImages(data);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/gallery/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Image uploaded successfully!");
      setFile(null);
      fetchImages();
    } else {
      setMessage(data.error);
    }
  };

  const handleDelete = async (id, image_url) => {
    const confirmDelete = confirm("Delete this image?");
    if (!confirmDelete) return;

    await fetch("/api/gallery/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, image_url }),
    });

    fetchImages();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">
        Gallery Management
      </h1>

      {/* Upload Section */}
      <form
        onSubmit={handleUpload}
        className="bg-white p-8 rounded-xl shadow w-96 mb-10"
      >
        <input
          type="file"
          accept="image/*"
          className="mb-4"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
        >
          Upload Image
        </button>

        {message && (
          <p className="mt-4 text-center font-semibold text-gray-700">
            {message}
          </p>
        )}
      </form>

      {/* Gallery List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((img) => (
          <div
            key={img.id}
            className="bg-white rounded-xl shadow overflow-hidden relative"
          >
            <img
              src={img.image_url}
              alt="Gallery"
              className="w-full h-60 object-cover"
            />

            <button
              onClick={() => handleDelete(img.id, img.image_url)}
              className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
