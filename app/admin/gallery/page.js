"use client";

import { useEffect, useState } from "react";

export default function AdminGallery() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [fixingColumn, setFixingColumn] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/gallery");
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setImages(data);
    } catch (error) {
      console.error("Failed to fetch images:", error);
      setError(error.message);
      
      // Fallback images for Vercel deployment
      setImages([
        {
          id: 1,
          file_path: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
        },
        {
          id: 2,
          file_path: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
        },
        {
          id: 3,
          file_path: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select an image.");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("🚀 Starting upload...");
      const res = await fetch("/api/gallery/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("📨 Upload response:", data);

      if (res.ok) {
        setMessage(`✅ ${data.message} (Storage: ${data.storage}, ID: ${data.id})`);
        setFile(null);
        
        // Debug: Check database immediately after upload
        console.log("🔍 Checking database after upload...");
        const debugRes = await fetch("/api/gallery/debug");
        const debugInfo = await debugRes.json();
        console.log("🔍 Debug info:", debugInfo);
        
        fetchImages();
      } else {
        setMessage(`❌ ${data.error || "Upload failed"}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("❌ Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, image_url) => {
    const confirmDelete = confirm("Delete this image?");
    if (!confirmDelete) return;

    setDeleting(id);

    try {
      const res = await fetch("/api/gallery/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, image_url }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Image deleted successfully!");
        fetchImages();
      } else {
        setMessage(data.error || "Delete failed. Database connection may be unavailable.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("Delete failed. Database connection may be unavailable on Vercel.");
    } finally {
      setDeleting(null);
    }
  };

  const checkDebugInfo = async () => {
    try {
      console.log("🔍 Fetching debug info...");
      const res = await fetch("/api/gallery/debug");
      const info = await res.json();
      setDebugInfo(info);
      console.log("🔍 Debug info:", info);
    } catch (error) {
      console.error("Debug fetch error:", error);
      setDebugInfo({ error: error.message });
    }
  };

  const fixGalleryColumn = async () => {
    setFixingColumn(true);
    try {
      console.log("🔧 Fixing gallery column...");
      const res = await fetch("/api/gallery/fix-column", { method: "POST" });
      const result = await res.json();
      
      if (res.ok) {
        setMessage(`✅ ${result.message}`);
        // Refresh debug info
        await checkDebugInfo();
      } else {
        setMessage(`❌ ${result.error}`);
      }
    } catch (error) {
      console.error("Fix column error:", error);
      setMessage("❌ Failed to fix gallery column");
    } finally {
      setFixingColumn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">
        Gallery Management
      </h1>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6">
          <p className="text-sm">
            <strong>Note:</strong> Database connection unavailable. Using sample images. Error: {error}
          </p>
        </div>
      )}

      {/* Debug Section */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-blue-800">Database Debug Info</h3>
          <div className="space-x-2">
            <button
              onClick={fixGalleryColumn}
              className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 disabled:bg-gray-400"
              disabled={fixingColumn}
            >
              {fixingColumn ? "Fixing..." : "Fix Column Size"}
            </button>
            <button
              onClick={checkDebugInfo}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Check Debug Info
            </button>
          </div>
        </div>
        {debugInfo && (
          <div className="text-xs bg-white p-3 rounded border">
            <pre className="whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>

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
          disabled={uploading}
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>

        {message && (
          <p className={`mt-4 text-center font-semibold ${
            message.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}>
            {message}
          </p>
        )}
      </form>

      {/* Gallery List */}
      {loading && (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          <p className="mt-2 text-gray-600">Loading gallery...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-white rounded-xl shadow overflow-hidden relative"
            >
              <img
                src={img.file_path}
                alt="Gallery"
                className="w-full h-60 object-cover"
              />

              <button
                onClick={() => handleDelete(img.id, img.file_path)}
                className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={deleting === img.id}
              >
                {deleting === img.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && images.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No images found in the gallery.</p>
        </div>
      )}
    </div>
  );
}
