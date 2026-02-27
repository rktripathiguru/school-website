// Debug script to test the image endpoint
// Run this in browser console on the deployed site

const debugImageEndpoint = async () => {
  console.log('🔍 Debugging Image Endpoint...');
  
  // Test 1: Check what the teachers API returns
  console.log('\n📋 Testing /api/teachers...');
  try {
    const teachersResponse = await fetch('/api/teachers');
    const teachers = await teachersResponse.json();
    console.log('Teachers response:', teachers);
    
    teachers.forEach((teacher, index) => {
      console.log(`Teacher ${index + 1}:`, {
        id: teacher.id,
        name: teacher.name,
        image_url: teacher.image_url,
        image_mime_type: teacher.image_mime_type
      });
    });
  } catch (error) {
    console.error('Teachers API error:', error);
  }
  
  // Test 2: Test the image endpoint directly
  console.log('\n🖼️ Testing /api/teachers/image/1...');
  try {
    const imageResponse = await fetch('/api/teachers/image/1');
    console.log('Image response status:', imageResponse.status);
    console.log('Image response headers:', Object.fromEntries(imageResponse.headers.entries()));
    
    if (imageResponse.ok) {
      const contentType = imageResponse.headers.get('content-type');
      console.log('Content type:', contentType);
      
      if (contentType.includes('image/svg+xml')) {
        const svgText = await imageResponse.text();
        console.log('SVG length:', svgText.length);
        console.log('SVG preview:', svgText.substring(0, 100) + '...');
      } else {
        const imageBlob = await imageResponse.blob();
        console.log('Image blob size:', imageBlob.size);
        console.log('Image blob type:', imageBlob.type);
      }
    } else {
      const errorText = await imageResponse.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.error('Image endpoint error:', error);
  }
  
  // Test 3: Test default SVG directly
  console.log('\n🖼️ Testing /images/teachers/default.svg...');
  try {
    const defaultResponse = await fetch('/images/teachers/default.svg');
    console.log('Default SVG status:', defaultResponse.status);
    
    if (defaultResponse.ok) {
      const defaultSvg = await defaultResponse.text();
      console.log('Default SVG length:', defaultSvg.length);
      console.log('Default SVG works ✅');
    }
  } catch (error) {
    console.error('Default SVG error:', error);
  }
  
  // Test 4: Manual image creation test
  console.log('\n🔧 Testing manual image creation...');
  const testSvg = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#3b82f6"/>
      <text x="50" y="55" text-anchor="middle" fill="white" font-size="12">Test</text>
    </svg>
  `;
  console.log('Test SVG created:', testSvg.length, 'characters');
};

// Auto-run
debugImageEndpoint();

// Also provide a manual fix function
window.fixTeacherImages = () => {
  console.log('🔧 Applying manual image fix...');
  
  // Find all teacher images on the page
  const teacherImages = document.querySelectorAll('img[src*="/api/teachers/image/"]');
  console.log('Found', teacherImages.length, 'teacher images to fix');
  
  teacherImages.forEach((img, index) => {
    console.log(`Fixing image ${index + 1}:`, img.src);
    img.src = '/images/teachers/default.svg';
    img.onerror = null; // Remove error handler to prevent infinite loops
  });
  
  // Also fix any images that are currently broken
  const brokenImages = document.querySelectorAll('img[src*="undefined"], img[src*="null"]');
  console.log('Found', brokenImages.length, 'broken images to fix');
  
  brokenImages.forEach((img, index) => {
    console.log(`Fixing broken image ${index + 1}`);
    img.src = '/images/teachers/default.svg';
    img.onerror = null;
  });
  
  console.log('✅ Manual fix applied!');
};

console.log('🔧 To manually fix images, run: fixTeacherImages()');
