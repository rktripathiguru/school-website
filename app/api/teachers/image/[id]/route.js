import db from "@/lib/db";

export async function GET(request, { params }) {
  try {
    // Add immediate fallback for any parameter issues
    if (!params || !params.id) {
      console.log("❌ Invalid params, returning default image immediately");
      const svgPlaceholder = `
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.1" />
              <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:0.2" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="90" fill="url(#bg)" stroke="#3b82f6" stroke-width="2"/>
          <circle cx="100" cy="70" r="25" fill="#6b7280"/>
          <ellipse cx="100" cy="140" rx="35" ry="30" fill="#6b7280"/>
          <rect x="75" y="50" width="50" height="3" fill="#1f2937"/>
          <polygon points="70,50 100,40 130,50" fill="#1f2937"/>
          <rect x="95" y="50" width="10" height="15" fill="#1f2937"/>
          <text x="100" y="185" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="600" fill="#374151">
            Teacher Photo
          </text>
        </svg>
      `;
      
      return new Response(svgPlaceholder, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }
    
    const teacherId = params.id;
    
    console.log("=== Teacher Image Request Started ===");
    console.log("Full params:", params);
    console.log("Teacher ID:", teacherId);
    console.log("Teacher ID type:", typeof teacherId);
    
    if (!teacherId) {
      console.log("❌ No teacher ID provided");
      return Response.json({ error: "Teacher ID is required" }, { status: 400 });
    }

    try {
      const [rows] = await db.query(
        "SELECT image_data, image_mime_type, image_filename FROM teachers WHERE id = ?",
        [teacherId]
      );

      if (rows.length === 0) {
        console.log("❌ Teacher not found, returning default image");
        
        // Return default SVG when teacher not found
        const svgPlaceholder = `
          <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.1" />
                <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:0.2" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="90" fill="url(#bg)" stroke="#3b82f6" stroke-width="2"/>
            <circle cx="100" cy="70" r="25" fill="#6b7280"/>
            <ellipse cx="100" cy="140" rx="35" ry="30" fill="#6b7280"/>
            <rect x="75" y="50" width="50" height="3" fill="#1f2937"/>
            <polygon points="70,50 100,40 130,50" fill="#1f2937"/>
            <rect x="95" y="50" width="10" height="15" fill="#1f2937"/>
            <text x="100" y="185" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="600" fill="#374151">
              Teacher Photo
            </text>
          </svg>
        `;
        
        return new Response(svgPlaceholder, {
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=3600'
          }
        });
      }

      if (!rows[0].image_data) {
        console.log("❌ No image data found, returning default image");
        
        // Return default SVG when no image data
        const svgPlaceholder = `
          <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.1" />
                <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:0.2" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="90" fill="url(#bg)" stroke="#3b82f6" stroke-width="2"/>
            <circle cx="100" cy="70" r="25" fill="#6b7280"/>
            <ellipse cx="100" cy="140" rx="35" ry="30" fill="#6b7280"/>
            <rect x="75" y="50" width="50" height="3" fill="#1f2937"/>
            <polygon points="70,50 100,40 130,50" fill="#1f2937"/>
            <rect x="95" y="50" width="10" height="15" fill="#1f2937"/>
            <text x="100" y="185" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="600" fill="#374151">
              Teacher Photo
            </text>
          </svg>
        `;
        
        return new Response(svgPlaceholder, {
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=3600'
          }
        });
      }

      const teacher = rows[0];
      const imageBuffer = Buffer.from(teacher.image_data);
      
      return new Response(imageBuffer, {
        headers: {
          'Content-Type': teacher.image_mime_type || 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
          'Content-Disposition': `inline; filename="${teacher.image_filename || 'teacher-image.jpg'}"`
        }
      });

    } catch (dbError) {
      console.error("❌ Database error:", dbError.message);
      console.error("❌ Database error code:", dbError.code);
      
      // If database connection fails, return a default image
      if (dbError.code === 'ECONNREFUSED' || dbError.code === 'ENOTFOUND' || dbError.code === 'ETIMEDOUT') {
        console.log("🔄 Database not available, returning default image");
        
        // Return a simple SVG placeholder image
        const svgPlaceholder = `
          <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="#f3f4f6"/>
            <text x="100" y="100" text-anchor="middle" font-family="Arial" font-size="14" fill="#6b7280">
              Teacher Image
            </text>
            <text x="100" y="120" text-anchor="middle" font-family="Arial" font-size="12" fill="#9ca3af">
              (Demo Mode)
            </text>
          </svg>
        `;
        
        return new Response(svgPlaceholder, {
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=3600'
          }
        });
      }
      
      return Response.json({ error: "Failed to fetch image from database" }, { status: 500 });
    }
  } catch (error) {
    console.error("❌ Teacher Image API error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
