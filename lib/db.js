import mysql from "mysql2/promise";

// Database configuration for Railway MySQL
const pool = mysql.createPool(
  process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/school_db',
  {
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  }
);

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(error => {
    console.error('Database connection failed:', error.message);
  });

export default pool;
