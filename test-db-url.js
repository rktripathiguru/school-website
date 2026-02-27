// Test database connection using DATABASE_URL
// Run this with: node test-db-url.js

const mysql = require('mysql2/promise');
require('dotenv').config(); // Load environment variables

async function testDatabaseURL() {
  let connection;
  
  try {
    console.log('🔍 Testing Database Connection with DATABASE_URL...\n');
    
    // Check DATABASE_URL
    const databaseUrl = process.env.DATABASE_URL;
    console.log('📡 DATABASE_URL:', databaseUrl ? 'SET' : 'NOT SET');
    
    if (!databaseUrl) {
      console.log('❌ DATABASE_URL not found in environment variables');
      console.log('Please set DATABASE_URL in your .env file or Railway environment');
      console.log('Example: mysql://username:password@host:port/database');
      return;
    }
    
    // Parse DATABASE_URL to show connection details
    try {
      const url = new URL(databaseUrl);
      console.log('📊 Connection Details:');
      console.log('   Protocol:', url.protocol);
      console.log('   Host:', url.hostname);
      console.log('   Port:', url.port || '3306');
      console.log('   Database:', url.pathname.substring(1));
      console.log('   Username:', url.username);
      console.log('   Password:', url.password ? '***SET***' : 'NOT SET');
    } catch (e) {
      console.log('❌ Failed to parse DATABASE_URL:', e.message);
    }
    
    // Create connection using DATABASE_URL
    console.log('\n🔌 Connecting to database...');
    connection = await mysql.createConnection(
      databaseUrl,
      {
        connectionLimit: 10,
        acquireTimeout: 60000,
        timeout: 60000,
        reconnect: true,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      }
    );
    
    console.log('✅ Database connected successfully\n');
    
    // Test 1: Basic query
    console.log('🧪 Testing basic query...');
    const [testResult] = await connection.query('SELECT 1 as test, NOW() as current_time');
    console.log('✅ Basic query successful:', testResult[0]);
    
    // Test 2: Check teachers table
    console.log('\n📋 Checking teachers table...');
    const [tables] = await connection.query("SHOW TABLES LIKE 'teachers'");
    console.log('Teachers table exists:', tables.length > 0 ? 'YES' : 'NO');
    
    if (tables.length === 0) {
      console.log('❌ Teachers table does not exist');
      console.log('Please run the migration script to create the table');
      return;
    }
    
    // Test 3: Check table structure
    console.log('\n🏗️ Checking table structure...');
    const [columns] = await connection.query("DESCRIBE teachers");
    const imageColumns = columns.filter(col => 
      col.Field.includes('image') || col.Field.includes('mime') || col.Field.includes('filename')
    );
    console.log('Image-related columns:', imageColumns.map(col => `${col.Field} (${col.Type})`));
    
    // Test 4: Check teachers with images
    console.log('\n👥 Checking teachers with images...');
    const [teachers] = await connection.query(
      "SELECT id, name, image_mime_type, image_filename, LENGTH(image_data) as image_size, updated_at FROM teachers ORDER BY id"
    );
    
    console.log(`Found ${teachers.length} teachers total`);
    
    const teachersWithImages = teachers.filter(t => t.image_size > 0);
    console.log(`Teachers with images: ${teachersWithImages.length}`);
    
    if (teachersWithImages.length > 0) {
      console.log('\n📸 Teachers with images:');
      teachersWithImages.forEach((teacher, index) => {
        console.log(`${index + 1}. ${teacher.name} (ID: ${teacher.id}) - ${teacher.image_size} bytes`);
      });
      
      // Test 5: Test image data for first teacher with image
      const firstTeacher = teachersWithImages[0];
      console.log(`\n🔍 Testing image data for ${firstTeacher.name}...`);
      
      const [imageData] = await connection.query(
        "SELECT image_data, image_mime_type FROM teachers WHERE id = ?",
        [firstTeacher.id]
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
          console.log('Data value:', image.image_data);
        }
      }
    } else {
      console.log('❌ No teachers with images found');
      console.log('Try uploading an image via the admin panel first');
    }
    
    // Test 6: Test the exact API query
    console.log('\n🔍 Testing API query...');
    const [apiResult] = await connection.query(
      "SELECT id, name, image_mime_type, image_data FROM teachers WHERE is_active = TRUE ORDER BY display_order ASC, name ASC"
    );
    
    console.log(`API query found ${apiResult.length} active teachers`);
    apiResult.forEach((teacher, index) => {
      const hasImage = teacher.image_data && teacher.image_data.length > 0;
      console.log(`API Teacher ${index + 1}: ${teacher.name} - hasImage: ${hasImage}, size: ${teacher.image_data ? teacher.image_data.length : 0}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Error code:', error.code);
    console.error('Stack:', error.stack);
    
    // Provide specific help based on error code
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Connection refused - Check:');
      console.log('   - DATABASE_URL is correct');
      console.log('   - Database server is running');
      console.log('   - Network allows connection');
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Host not found - Check:');
      console.log('   - DATABASE_URL hostname is correct');
      console.log('   - DNS resolution');
      console.log('   - Railway service is running');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('\n💡 Connection timeout - Check:');
      console.log('   - Network connectivity');
      console.log('   - Database server response time');
      console.log('   - SSL configuration');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Access denied - Check:');
      console.log('   - DATABASE_URL username and password');
      console.log('   - Database user permissions');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Database not found - Check:');
      console.log('   - DATABASE_URL database name');
      console.log('   - Database exists on server');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the test
testDatabaseURL();
