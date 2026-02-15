export default function About() {
  return (
    <div className="py-20 px-10 bg-gray-200 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-800 text-center">
        About U. M. S. Jevari
      </h1>

      <div className="mt-12 max-w-4xl mx-auto text-gray-700 space-y-6 text-lg">
        <p>
          U. M. S. Jevari was established with the mission to provide
          quality education and shape future leaders.
        </p>

        <p>
          Our school focuses on academic excellence, character building,
          and holistic development of students.
        </p>

        <p>
          With experienced teachers and modern infrastructure, we ensure
          that every student achieves their full potential.
        </p>
      </div>
      {/* Teachers Section */}
<div className="max-w-6xl mx-auto px-6 py-16">
  <h2 className="text-3xl font-bold text-center text-blue-700 mb-10">
    Our Teachers
  </h2>

  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">

    {/* Teacher Card */}
    <div className="bg-white shadow-lg rounded-xl p-6 text-center">
      <img
        src="/images/teachers/teacher1.jpg"
        alt="Teacher"
        className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
      />
      <h3 className="font-semibold text-blue-700">Mr. Ritesh Tiwari</h3>
      <p className="text-gray-500">Mathematics Teacher</p>
    </div>

    <div className="bg-white shadow-lg rounded-xl p-6 text-center">
      <img
        src="/images/teachers/teacher2.jpg"
        alt="Teacher"
        className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
      />
      <h3 className="font-semibold text-lg">Mrs. Sita Devi</h3>
      <p className="text-gray-500">Science Teacher</p>
    </div>

    <div className="bg-white shadow-lg rounded-xl p-6 text-center">
      <img
        src="/images/teachers/teacher3.jpg"
        alt="Teacher"
        className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
      />
      <h3 className="font-semibold text-lg">Mr. Aman Singh</h3>
      <p className="text-gray-500">English Teacher</p>
    </div>

  </div>
</div>

    </div>
  );
}
