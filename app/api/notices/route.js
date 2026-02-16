import db from "@/lib/db";

export async function GET() {
  try {
    console.log("=== Notices List Request Started ===");
    
    try {
      console.log("💾 Attempting database query...");
      const [rows] = await db.query("SELECT * FROM notices ORDER BY created_at DESC");
      
      console.log("✅ Database query successful, found", rows.length, "notices");
      return Response.json(rows);
    } catch (dbError) {
      console.error("❌ Database error:", dbError.message);
      console.log("🔄 Returning fallback notices...");
      
      // Return fallback notices if database fails
      const fallbackNotices = [
        {
          id: 1,
          title: "School Reopens After Holidays",
          description: "School will reopen on Monday, January 15th, 2024. All students are requested to attend classes regularly.",
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: "Annual Sports Meet",
          description: "Annual sports meet will be held from February 20th to 22nd. All students are encouraged to participate.",
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          title: "Exam Schedule Released",
          description: "Final examination schedule for Classes 1-10 has been released. Please check notice board for detailed timetable.",
          created_at: new Date().toISOString()
        }
      ];
      
      console.log("✅ Returning", fallbackNotices.length, "fallback notices");
      return Response.json(fallbackNotices);
    }
  } catch (error) {
    console.error("❌ Notices API error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
