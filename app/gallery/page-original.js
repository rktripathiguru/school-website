"use client";

import { useEffect, useState } from "react";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

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
      
      // Fallback to localStorage or default images
      try {
        const storedImages = localStorage.getItem('galleryImages');
        if (storedImages) {
          setImages(JSON.parse(storedImages));
        } else {
          // Default fallback images
          setImages([
            {
              id: 1,
              file_path: "/images/gallery/school1.jpg",
            },
            {
              id: 2,
              file_path: "/images/gallery/school2.jpg",
            },
            {
              id: 3,
              file_path: "/images/gallery/school3.jpg",
            },
          ]);
        }
      } catch (localStorageError) {
        console.error("Failed to load from localStorage:", localStorageError);
      }
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-10">
        School Gallery
      </h1>

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
              className="bg-white rounded-xl shadow overflow-hidden cursor-pointer group relative"
              onClick={() => openLightbox(img)}
            >
              <img
                src={img.file_path || img.image_url}
                alt="Gallery"
                className="w-full h-60 object-cover group-hover:scale-105 transition duration-300"
                onError={(e) => {
                  console.log("Image failed to load:", img.file_path || img.image_url);
                  // Try alternative field
                  if (img.image_url && e.target.src !== img.image_url) {
                    e.target.src = img.image_url;
                  }
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0m-14 0v14" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && images.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No images found in the gallery.</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div 
            className="relative max-w-4xl max-h-full bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 rounded-full p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <img
              src={selectedImage.file_path || selectedImage.image_url}
              alt="Gallery full size"
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
