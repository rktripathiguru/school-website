async function getNotices() {
  const res = await fetch("/api/notices", {
    cache: "no-store",
  });

  return res.json();
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
