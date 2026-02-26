const mysql = require('mysql2/promise');

async function runMigration() {
  let connection;
  
  try {
    // Use the same database configuration as lib/db.js
    const databaseUrl = process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/school_db';
    
    console.log('🔗 Attempting to connect to database...');
    connection = await mysql.createConnection(databaseUrl);
    console.log('✅ Connected to database successfully');

    // Create teachers table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS teachers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    console.log('📝 Creating teachers table...');
    await connection.execute(createTableSQL);
    console.log('✅ Teachers table created successfully');

    // Check if teachers already exist
    const [existingTeachers] = await connection.execute('SELECT COUNT(*) as count FROM teachers');
    
    if (existingTeachers[0].count === 0) {
      // Insert existing teachers data
      const insertSQL = `
        INSERT INTO teachers (name, subject, image_url) VALUES
        ('Mr. Ritesh Tiwari', 'Mathematics Teacher', '/images/teachers/teacher1.jpg'),
        ('Mrs. Sita Devi', 'Science Teacher', '/images/teachers/teacher2.jpg'),
        ('Mr. Aman Singh', 'English Teacher', '/images/teachers/teacher3.jpg')
      `;

      console.log('📝 Inserting default teachers data...');
      await connection.execute(insertSQL);
      console.log('✅ Default teachers data inserted successfully');
    } else {
      console.log(`📊 Teachers table already has ${existingTeachers[0].count} records`);
    }

    // Verify the table was created and has data
    const [rows] = await connection.execute('SELECT * FROM teachers');
    console.log(`🎉 Migration completed! Teachers table now has ${rows.length} records:`);
    rows.forEach(teacher => {
      console.log(`   - ${teacher.name} (${teacher.subject})`);
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
