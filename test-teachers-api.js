// Test script for teachers API
// Run this to test if the API works in demo mode

const testTeachersAPI = async () => {
  try {
    console.log('🧪 Testing Teachers API...');
    
    // Test GET request
    console.log('\n📋 Testing GET /api/teachers...');
    const getResponse = await fetch('http://localhost:3000/api/teachers');
    const teachers = await getResponse.json();
    console.log('✅ GET Response:', teachers.length, 'teachers found');
    
    // Test POST request (add teacher)
    console.log('\n➕ Testing POST /api/teachers...');
    const formData = new FormData();
    formData.append('name', 'Test Teacher');
    formData.append('subject', 'Test Subject');
    formData.append('email', 'test@example.com');
    formData.append('phone', '1234567890');
    formData.append('bio', 'Test bio');
    formData.append('experience_years', '5');
    formData.append('qualification', 'Test Qualification');
    formData.append('display_order', '10');
    
    const postResponse = await fetch('http://localhost:3000/api/teachers', {
      method: 'POST',
      body: formData
    });
    const postResult = await postResponse.json();
    console.log('✅ POST Response:', postResult.message);
    
    // Test PUT request (update teacher)
    if (postResult.id) {
      console.log('\n✏️ Testing PUT /api/teachers...');
      const updateFormData = new FormData();
      updateFormData.append('id', postResult.id);
      updateFormData.append('name', 'Updated Test Teacher');
      updateFormData.append('subject', 'Updated Test Subject');
      
      const putResponse = await fetch('http://localhost:3000/api/teachers', {
        method: 'PUT',
        body: updateFormData
      });
      const putResult = await putResponse.json();
      console.log('✅ PUT Response:', putResult.message);
    }
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('📝 Note: Running in demo mode - data is not persisted');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the development server is running:');
    console.log('   npm run dev');
  }
};

// Run the test
testTeachersAPI();
