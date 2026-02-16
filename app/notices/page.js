async function getNotices() {
  try {
    const res = await fetch("/api/notices", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch notices:", error);
    // Return fallback notices if database fails
    return [
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
        description: "Final examination schedule for Classes 1-10 has been released. Please check the notice board for detailed timetable.",
        created_at: new Date().toISOString()
      }
    ];
  }
}

export default async function Notices() {
  const notices = await getNotices();

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <h1 className="text-4xl font-bold text-blue-800 text-center mb-4">
        School Notices
      </h1>

      <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>

      <div className="mt-12 max-w-4xl mx-auto space-y-6">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-semibold text-blue-700">
              {notice.title}
            </h2>

            <p className="text-gray-600 mt-2">
              {notice.description}
            </p>

            <p className="text-sm text-gray-400 mt-4">
              Posted on: {new Date(notice.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
