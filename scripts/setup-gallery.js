import db from "../lib/db.js";

async function setupGalleryTable() {
  try {
    console.log("=== Setting up Gallery Table ===");
    
    // Check if gallery table exists
    const [tableCheck] = await db.query("SHOW TABLES LIKE 'gallery'");
    console.log("Gallery table exists:", tableCheck.length > 0 ? "Yes" : "No");
    
    if (tableCheck.length === 0) {
      console.log("Creating gallery table...");
      
      // Create the gallery table
      const createTableSQL = `
        CREATE TABLE gallery (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          file_path VARCHAR(500) NOT NULL,
          file_name VARCHAR(255) NOT NULL,
          file_size INT NOT NULL,
          mime_type VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `;
      
      await db.query(createTableSQL);
      console.log("✅ Gallery table created successfully!");
      
      // Add index
      await db.query("CREATE INDEX idx_gallery_created_at ON gallery(created_at)");
      console.log("✅ Index created successfully!");
      
    } else {
      console.log("Gallery table already exists. Checking structure...");
      const [columns] = await db.query("DESCRIBE gallery");
      console.log("Table structure:", columns.map(col => `${col.Field} (${col.Type})`));
    }
    
    // Test insert and select
    console.log("\n=== Testing Gallery Operations ===");
    
    // Clear any test data
    await db.query("DELETE FROM gallery WHERE title LIKE 'test-%'");
    
    // Test insert
    const testImagePath = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
    const [insertResult] = await db.query(
      "INSERT INTO gallery (title, description, file_path, file_name, file_size, mime_type) VALUES (?, ?, ?, ?, ?, ?)",
      ["test-image", "Test image for gallery", testImagePath, "test.png", 100, "image/png"]
    );
    console.log("✅ Test insert successful, ID:", insertResult.insertId);
    
    // Test select
    const [rows] = await db.query("SELECT * FROM gallery ORDER BY created_at DESC");
    console.log("✅ Gallery now has", rows.length, "images");
    
    if (rows.length > 0) {
      console.log("Sample image:", {
        id: rows[0].id,
        title: rows[0].title,
        file_name: rows[0].file_name,
        file_path_length: rows[0].file_path.length,
        created_at: rows[0].created_at
      });
    }
    
    // Clean up test data
    await db.query("DELETE FROM gallery WHERE title LIKE 'test-%'");
    console.log("✅ Test data cleaned up");
    
    console.log("\n🎉 Gallery table setup complete!");
    
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    console.error("Full error:", error);
  } finally {
    process.exit(0);
  }
}

setupGalleryTable();
