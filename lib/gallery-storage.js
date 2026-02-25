// Persistent fallback storage for gallery images when database is unavailable
// Using localStorage-like approach with file system persistence

let fallbackStorage = [];

// Load fallback storage from file if exists
function loadFallbackStorage() {
  try {
    // In a real implementation, you'd read from a persistent storage
    // For now, we'll use in-memory with better persistence strategy
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('galleryFallbackStorage');
      if (stored) {
        fallbackStorage = JSON.parse(stored);
      }
    }
  } catch (error) {
    console.log("No existing fallback storage found");
  }
}

// Save fallback storage to persistent storage
function saveFallbackStorage() {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('galleryFallbackStorage', JSON.stringify(fallbackStorage));
    }
  } catch (error) {
    console.error("Failed to save fallback storage:", error);
  }
}

// Initialize fallback storage
loadFallbackStorage();

export const galleryStorage = {
  // Add image to fallback storage
  addImage(imageData) {
    const imageRecord = {
      id: imageData.id || Date.now() + Math.random().toString(36).substr(2, 9),
      file_path: imageData.image_url || imageData.file_path, // Support both fields
      image_url: imageData.image_url || imageData.file_path, // Backward compatibility
      created_at: imageData.created_at || new Date().toISOString(),
      storage: "fallback"
    };
    
    fallbackStorage.push(imageRecord);
    saveFallbackStorage();
    
    console.log("Added image to fallback storage, total:", fallbackStorage.length);
    return imageRecord;
  },

  // Get all images from fallback storage
  getImages() {
    // Sort by creation date (newest first)
    const sorted = fallbackStorage.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Always include some default images if storage is empty
    if (sorted.length === 0) {
      return [
        {
          id: 1,
          file_path: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
          image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          storage: "default"
        },
        {
          id: 2,
          file_path: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
          image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
          created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          storage: "default"
        },
        {
          id: 3,
          file_path: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop",
          image_url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop",
          created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          storage: "default"
        }
      ];
    }
    
    return sorted;
  },

  // Delete image from fallback storage
  deleteImage(id) {
    const initialLength = fallbackStorage.length;
    fallbackStorage = fallbackStorage.filter(img => img.id !== id);
    saveFallbackStorage();
    
    console.log("Deleted image from fallback storage, remaining:", fallbackStorage.length);
    return fallbackStorage.length < initialLength;
  },

  // Clear all fallback storage
  clearStorage() {
    fallbackStorage = [];
    saveFallbackStorage();
  },

  // Get storage count
  getStorageCount() {
    return fallbackStorage.length;
  },

  // Force reload from persistent storage
  reloadStorage() {
    loadFallbackStorage();
  }
};
