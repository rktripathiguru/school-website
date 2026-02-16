"use client";

import { useEffect, useState } from "react";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchImages();
    
    // Also try to load from localStorage as backup
    try {
      if (typeof window !== 'undefined') {
        const storedImages = localStorage.getItem('galleryImages');
        if (storedImages) {
          const parsedImages = JSON.parse(storedImages);
          if (parsedImages.length > 0) {
            setImages(parsedImages);
            setError(null); // Clear any error state
          }
        }
      }
    } catch (error) {
      console.error("Failed to load images from localStorage:", error);
    }
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/gallery/list");
      
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
          image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
        },
        {
          id: 2,
          image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
        },
        {
          id: 3,
          image_url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop",
        },
        {
          id: 4,
          image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop",
        },
        {
          id: 5,
          image_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop",
        },
        {
          id: 6,
          image_url: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&h=600&fit=crop",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Save images to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && images.length > 0) {
      localStorage.setItem('galleryImages', JSON.stringify(images));
    }
  }, [images]);

  const openLightbox = (image) => {
    setSelectedImage(image);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    // Restore body scroll
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

      {!loading && error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6">
          <p className="text-sm">
            <strong>Note:</strong> Using sample images. Database connection unavailable: {error}
          </p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-white rounded-xl shadow overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(img)}
            >
              <img
                src={img.image_url}
                alt="Gallery"
                className="w-full h-60 object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition duration-300 flex items-center justify-center">
                <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 rounded-full p-2 transition duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Full size image */}
            <img
              src={selectedImage.image_url}
              alt="Gallery full size"
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
