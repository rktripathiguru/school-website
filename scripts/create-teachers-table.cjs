const mysql = require('mysql2/promise');

async function runMigration() {
  let connection;
  
  try {
    // Use the same database configuration as lib/db.js
    const databaseUrl = process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/school_db';
    
    console.log('🔗 Attempting to connect to database...');
    connection = await mysql.createConnection(databaseUrl);
    console.log('✅ Connected to database successfully');

    // Create teachers table with new schema for image storage
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS teachers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        email VARCHAR(255) NULL,
        phone VARCHAR(50) NULL,
        image_data LONGBLOB NULL,
        image_mime_type VARCHAR(100) NULL,
        image_filename VARCHAR(255) NULL,
        bio TEXT NULL,
        experience_years INT NULL,
        qualification VARCHAR(255) NULL,
        is_active BOOLEAN DEFAULT TRUE,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_teachers_active (is_active),
        INDEX idx_teachers_order (display_order),
        INDEX idx_teachers_subject (subject)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    console.log('📝 Creating teachers table...');
    await connection.execute(createTableSQL);
    console.log('✅ Teachers table created successfully');

    // Check if teachers already exist
    const [existingTeachers] = await connection.execute('SELECT COUNT(*) as count FROM teachers');
    
    if (existingTeachers[0].count === 0) {
      // Insert existing teachers data (without images initially)
      const insertSQL = `
        INSERT INTO teachers (name, subject, email, phone, bio, experience_years, qualification, display_order) VALUES
        ('Mr. Ritesh Tiwari', 'Mathematics', 'ritesh.tiwari@umsjevari.edu', '9876543210', 'Experienced mathematics teacher with expertise in algebra and geometry.', 15, 'M.Sc. Mathematics', 1),
        ('Mrs. Sita Devi', 'Science', 'sita.devi@umsjevari.edu', '9876543211', 'Dedicated science teacher specializing in physics and chemistry.', 12, 'M.Sc. Physics', 2),
        ('Mr. Aman Singh', 'English', 'aman.singh@umsjevari.edu', '9876543212', 'Creative English teacher with strong background in literature.', 10, 'M.A. English', 3)
      `;

      console.log('📝 Inserting default teachers data...');
      await connection.execute(insertSQL);
      console.log('✅ Default teachers data inserted successfully');
    } else {
      console.log(`📊 Teachers table already has ${existingTeachers[0].count} records`);
    }

    // Verify the table was created and has data
    const [rows] = await connection.execute('SELECT id, name, subject, email, phone, bio, experience_years, qualification, is_active, display_order FROM teachers ORDER BY display_order ASC');
    console.log(`🎉 Migration completed! Teachers table now has ${rows.length} records:`);
    rows.forEach(teacher => {
      console.log(`   - ${teacher.name} (${teacher.subject}) - ${teacher.is_active ? 'Active' : 'Inactive'}`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

runMigration();
