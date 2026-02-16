// Shared fallback storage for gallery images when database is unavailable
let fallbackStorage = [];

export const galleryStorage = {
  // Add image to fallback storage
  addImage(imageData) {
    const imageRecord = {
      id: imageData.id || Date.now() + Math.random().toString(36).substr(2, 9),
      image_url: imageData.image_url,
      created_at: imageData.created_at || new Date().toISOString(),
      storage: "fallback"
    };
    
    fallbackStorage.push(imageRecord);
    return imageRecord;
  },

  // Get all images from fallback storage
  getImages() {
    return fallbackStorage.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  // Delete image from fallback storage
  deleteImage(id) {
    const initialLength = fallbackStorage.length;
    fallbackStorage = fallbackStorage.filter(img => img.id !== id);
    return fallbackStorage.length < initialLength;
  },

  // Clear all fallback storage
  clearStorage() {
    fallbackStorage = [];
  },

  // Get storage count
  getStorageCount() {
    return fallbackStorage.length;
  }
};
