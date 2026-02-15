import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "000000",   // use your password
  database: "school_db",
});

export default db;
