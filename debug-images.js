// Debug script to test teacher image functionality
// Run this in browser console or as a script

const debugTeacherImages = async () => {
  console.log('🔍 Debugging Teacher Images...');
  
  try {
    // 1. Test teachers API
    console.log('\n📋 Testing GET /api/teachers...');
    const teachersResponse = await fetch('/api/teachers');
    const teachers = await teachersResponse.json();
    
    console.log('✅ Teachers found:', teachers.length);
    teachers.forEach((teacher, index) => {
      console.log(`   ${index + 1}. ${teacher.name} - Image URL: ${teacher.image_url || 'No image'}`);
    });
    
    // 2. Test image serving for first teacher with image
    const teacherWithImage = teachers.find(t => t.image_url);
    if (teacherWithImage) {
      console.log('\n🖼️ Testing image URL:', teacherWithImage.image_url);
      
      try {
        const imageResponse = await fetch(teacherWithImage.image_url);
        console.log('✅ Image response status:', imageResponse.status);
        console.log('✅ Image content type:', imageResponse.headers.get('content-type'));
        
        if (imageResponse.ok) {
          const imageBlob = await imageResponse.blob();
          console.log('✅ Image size:', imageBlob.size, 'bytes');
          console.log('✅ Image type:', imageBlob.type);
        } else {
          const errorText = await imageResponse.text();
          console.log('❌ Image error:', errorText);
        }
      } catch (imageError) {
        console.log('❌ Image fetch error:', imageError.message);
      }
    } else {
      console.log('\n⚠️ No teachers with images found');
    }
    
    // 3. Test default image
    console.log('\n🖼️ Testing default image...');
    try {
      const defaultResponse = await fetch('/images/teachers/default.svg');
      console.log('✅ Default image status:', defaultResponse.status);
      
      if (defaultResponse.ok) {
        const defaultBlob = await defaultResponse.blob();
        console.log('✅ Default image size:', defaultBlob.size, 'bytes');
      }
    } catch (defaultError) {
      console.log('❌ Default image error:', defaultError.message);
    }
    
    // 4. Test image upload simulation
    console.log('\n📤 Testing image upload simulation...');
    const testFormData = new FormData();
    testFormData.append('name', 'Test Teacher');
    testFormData.append('subject', 'Test Subject');
    
    // Create a test image blob
    const testImageBlob = new Blob(['test image data'], { type: 'image/jpeg' });
    const testFile = new File([testImageBlob], 'test.jpg', { type: 'image/jpeg' });
    testFormData.append('image', testFile);
    
    try {
      const uploadResponse = await fetch('/api/teachers', {
        method: 'POST',
        body: testFormData
      });
      const uploadResult = await uploadResponse.json();
      console.log('✅ Upload response:', uploadResult.message);
      console.log('✅ Upload image URL:', uploadResult.image_url);
    } catch (uploadError) {
      console.log('❌ Upload error:', uploadError.message);
    }
    
  } catch (error) {
    console.error('❌ Debug script error:', error.message);
  }
};

// Auto-run if in browser
if (typeof window !== 'undefined') {
  debugTeacherImages();
} else {
  console.log('Run this script in browser console or use: node debug-images.js');
}

module.exports = { debugTeacherImages };
