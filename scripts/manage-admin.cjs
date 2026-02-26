const mysql = require('mysql2/promise');

async function manageAdmin() {
  let connection;
  
  try {
    // Use the same database configuration as lib/db.js
    const databaseUrl = process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/school_db';
    
    connection = await mysql.createConnection(databaseUrl);
    console.log('🔗 Connected to database successfully');

    // Create admin table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        full_name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_admin_username (username),
        INDEX idx_admin_email (email),
        INDEX idx_admin_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.execute(createTableSQL);
    console.log('✅ Admin table created successfully');

    // Check if admin user exists
    const [existingAdmin] = await connection.execute('SELECT COUNT(*) as count FROM admin WHERE username = "admin"');
    
    if (existingAdmin[0].count === 0) {
      // Insert default admin user
      const insertSQL = `
        INSERT INTO admin (username, password, email, full_name, role) 
        VALUES ('admin', 'admin123', 'admin@umsjevari.edu', 'System Administrator', 'admin')
      `;

      await connection.execute(insertSQL);
      console.log('✅ Default admin user created:');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('   ⚠️  Please change these credentials after first login!');
    } else {
      console.log('📊 Admin user already exists');
      
      // Show current admin users
      const [admins] = await connection.execute(
        'SELECT id, username, email, full_name, role, is_active, created_at FROM admin ORDER BY created_at DESC'
      );
      
      console.log('\n👥 Current Admin Users:');
      admins.forEach(admin => {
        console.log(`   - ${admin.username} (${admin.full_name || 'N/A'}) - ${admin.role} - ${admin.is_active ? 'Active' : 'Inactive'}`);
      });
    }

    console.log('\n🔧 To change admin credentials, run:');
    console.log('   UPDATE admin SET password = "newpassword" WHERE username = "admin";');
    console.log('   Or use the admin management interface after logging in.');

  } catch (error) {
    console.error('❌ Admin management failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Command line interface
const args = process.argv.slice(2);
const command = args[0];

if (command === 'change-password') {
  const username = args[1];
  const newPassword = args[2];
  
  if (!username || !newPassword) {
    console.log('Usage: node scripts/manage-admin.cjs change-password <username> <new-password>');
    process.exit(1);
  }
  
  changePassword(username, newPassword);
} else if (command === 'add-user') {
  const username = args[1];
  const password = args[2];
  const email = args[3];
  const fullName = args[4];
  
  if (!username || !password || !email) {
    console.log('Usage: node scripts/manage-admin.cjs add-user <username> <password> <email> [full-name]');
    process.exit(1);
  }
  
  addAdminUser(username, password, email, fullName);
} else {
  // Default: setup admin table
  manageAdmin();
}

async function changePassword(username, newPassword) {
  let connection;
  
  try {
    const databaseUrl = process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/school_db';
    connection = await mysql.createConnection(databaseUrl);
    
    const [result] = await connection.execute(
      'UPDATE admin SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE username = ?',
      [newPassword, username]
    );
    
    if (result.affectedRows > 0) {
      console.log(`✅ Password updated for user: ${username}`);
    } else {
      console.log(`❌ User not found: ${username}`);
    }
    
  } catch (error) {
    console.error('❌ Password change failed:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function addAdminUser(username, password, email, fullName) {
  let connection;
  
  try {
    const databaseUrl = process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/school_db';
    connection = await mysql.createConnection(databaseUrl);
    
    const [result] = await connection.execute(
      'INSERT INTO admin (username, password, email, full_name, role) VALUES (?, ?, ?, ?, "admin")',
      [username, password, email, fullName || username]
    );
    
    console.log(`✅ New admin user created: ${username} (ID: ${result.insertId})`);
    
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log(`❌ Username or email already exists: ${username}`);
    } else {
      console.error('❌ User creation failed:', error.message);
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
