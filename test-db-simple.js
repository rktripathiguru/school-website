// Simple database test using the app's database connection
// Run this with: node test-db-simple.js

// Import the same database connection as the app
const db = require('./lib/db.js');

async function testDatabaseSimple() {
  try {
    console.log('🔍 Testing Database Connection (using app config)...\n');
    
    // Test 1: Check if we can connect
    console.log('📡 Testing database connection...');
    const [result] = await db.query('SELECT 1 as test');
    console.log('✅ Database connection successful:', result[0].test === 1 ? 'YES' : 'NO');
    
    // Test 2: Check teachers table
    console.log('\n📋 Checking teachers table...');
    try {
      const [tables] = await db.query("SHOW TABLES LIKE 'teachers'");
      console.log('Teachers table exists:', tables.length > 0 ? 'YES' : 'NO');
      
      if (tables.length === 0) {
        console.log('❌ Teachers table does not exist');
        return;
      }
    } catch (error) {
      console.log('❌ Error checking table:', error.message);
      return;
    }
    
    // Test 3: Check table structure
    console.log('\n🏗️ Checking table structure...');
    try {
      const [columns] = await db.query("DESCRIBE teachers");
      const imageColumns = columns.filter(col => 
        col.Field.includes('image') || col.Field.includes('mime') || col.Field.includes('filename')
      );
      console.log('Image-related columns:', imageColumns.map(col => `${col.Field} (${col.Type})`));
    } catch (error) {
      console.log('❌ Error checking structure:', error.message);
    }
    
    // Test 4: Check all teachers
    console.log('\n👥 Checking all teachers...');
    try {
      const [teachers] = await db.query(
        "SELECT id, name, image_mime_type, image_filename, LENGTH(image_data) as image_size, updated_at FROM teachers ORDER BY id"
      );
      
      console.log(`Found ${teachers.length} teachers:\n`);
      teachers.forEach((teacher, index) => {
        console.log(`${index + 1}. ID: ${teacher.id}`);
        console.log(`   Name: ${teacher.name}`);
        console.log(`   MIME Type: ${teacher.image_mime_type || 'NULL'}`);
        console.log(`   Filename: ${teacher.image_filename || 'NULL'}`);
        console.log(`   Image Size: ${teacher.image_size || 0} bytes`);
        console.log(`   Updated: ${teacher.updated_at}`);
        console.log(`   Has Image: ${teacher.image_size > 0 ? '✅ YES' : '❌ NO'}`);
        console.log('');
      });
      
      // Test 5: Check specific teacher with image
      const teacherWithImage = teachers.find(t => t.image_size > 0);
      if (teacherWithImage) {
        console.log('🖼️ Testing teacher with image:', teacherWithImage.name);
        
        const [imageData] = await db.query(
          "SELECT image_data, image_mime_type FROM teachers WHERE id = ?",
          [teacherWithImage.id]
        );
        
        if (imageData.length > 0) {
          const image = imageData[0];
          console.log('Image data type:', typeof image.image_data);
          console.log('Image data constructor:', image.image_data.constructor.name);
          console.log('Image data length:', image.image_data ? image.image_data.length : 0);
          console.log('MIME type:', image.image_mime_type);
          
          // Test if it's a Buffer
          if (Buffer.isBuffer(image.image_data)) {
            console.log('✅ Image data is a Buffer');
            console.log('First 10 bytes:', Array.from(image.image_data.slice(0, 10)));
          } else {
            console.log('❌ Image data is not a Buffer');
            console.log('Trying to convert...');
            try {
              const buffer = Buffer.from(image.image_data);
              console.log('✅ Successfully converted to Buffer');
              console.log('Converted buffer length:', buffer.length);
            } catch (e) {
              console.log('❌ Failed to convert:', e.message);
            }
          }
        }
      } else {
        console.log('❌ No teachers with images found');
      }
      
    } catch (error) {
      console.log('❌ Error checking teachers:', error.message);
    }
    
    // Test 6: Time zone check
    console.log('\n🕐 Time zone information...');
    try {
      const [timeInfo] = await db.query("SELECT NOW() as server_time, UTC_TIMESTAMP() as utc_time");
      console.log('Server time:', timeInfo[0].server_time);
      console.log('UTC time:', timeInfo[0].utc_time);
      
      const [timeZone] = await db.query("SELECT @@session.time_zone as session_timezone");
      console.log('Session timezone:', timeZone[0].session_timezone);
    } catch (error) {
      console.log('❌ Error checking time zone:', error.message);
    }
    
    // Test 7: Test the exact query used by the API
    console.log('\n🔍 Testing API query...');
    try {
      const [apiResult] = await db.query(
        "SELECT id, name, subject, email, phone, bio, experience_years, qualification, is_active, display_order, image_mime_type, image_data FROM teachers WHERE is_active = TRUE ORDER BY display_order ASC, name ASC"
      );
      
      console.log(`API query found ${apiResult.length} active teachers`);
      apiResult.forEach((teacher, index) => {
        const hasImage = teacher.image_data && teacher.image_data.length > 0;
        console.log(`API Teacher ${index + 1}: ${teacher.name} - hasImage: ${hasImage}, size: ${teacher.image_data ? teacher.image_data.length : 0}`);
      });
    } catch (error) {
      console.log('❌ Error testing API query:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('Error code:', error.code);
    console.error('Stack:', error.stack);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Connection refused - Check:');
      console.log('   - Database server is running');
      console.log('   - Host and port are correct');
      console.log('   - Firewall allows connection');
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Host not found - Check:');
      console.log('   - DB_HOST environment variable');
      console.log('   - DNS resolution');
      console.log('   - Railway service is running');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('\n💡 Connection timeout - Check:');
      console.log('   - Network connectivity');
      console.log('   - Database server response time');
      console.log('   - SSL configuration');
    }
  }
}

// Run the test
testDatabaseSimple();
