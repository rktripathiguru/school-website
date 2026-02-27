// Test script to verify database connection and image data
// Run this with: node test-db-images.js

const mysql = require('mysql2/promise');

async function testDatabaseImages() {
  let connection;
  
  try {
    console.log('🔍 Testing Database Connection and Image Data...\n');
    
    // Database configuration
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'school_db',
      port: process.env.DB_PORT || 3306,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    };
    
    console.log('📡 Connecting to database...');
    console.log('Config:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port
    });
    
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected successfully\n');
    
    // Test 1: Check if teachers table exists
    console.log('📋 Checking teachers table...');
    const [tables] = await connection.execute("SHOW TABLES LIKE 'teachers'");
    console.log('Tables found:', tables.length);
    
    if (tables.length === 0) {
      console.log('❌ Teachers table does not exist');
      return;
    }
    
    // Test 2: Check table structure
    console.log('\n🏗️ Checking table structure...');
    const [columns] = await connection.execute("DESCRIBE teachers");
    const imageColumns = columns.filter(col => 
      col.Field.includes('image') || col.Field.includes('mime') || col.Field.includes('filename')
    );
    console.log('Image-related columns:', imageColumns.map(col => `${col.Field} (${col.Type})`));
    
    // Test 3: Check all teachers
    console.log('\n👥 Checking all teachers...');
    const [teachers] = await connection.execute(
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
    
    // Test 4: Check specific teacher with image
    const teacherWithImage = teachers.find(t => t.image_size > 0);
    if (teacherWithImage) {
      console.log('🖼️ Testing teacher with image:', teacherWithImage.name);
      
      const [imageData] = await connection.execute(
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
    
    // Test 5: Time zone check
    console.log('\n🕐 Time zone information...');
    const [timeInfo] = await connection.execute("SELECT NOW() as server_time, UTC_TIMESTAMP() as utc_time");
    console.log('Server time:', timeInfo[0].server_time);
    console.log('UTC time:', timeInfo[0].utc_time);
    
    const [timeZone] = await connection.execute("SELECT @@session.time_zone as session_timezone");
    console.log('Session timezone:', timeZone[0].session_timezone);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the test
testDatabaseImages();
