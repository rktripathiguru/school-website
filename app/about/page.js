"use client";

import { useEffect, useState } from "react";

export default function About() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/teachers");
      if (!res.ok) throw new Error("Failed to fetch teachers");
      const data = await res.json();
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      // Fallback to static teachers if API fails
      setTeachers([
        {
          id: 1,
          name: "Mr. Ritesh Tiwari",
          subject: "Mathematics Teacher",
          image_url: "/images/teachers/teacher1.jpg"
        },
        {
          id: 2,
          name: "Mrs. Sita Devi",
          subject: "Science Teacher",
          image_url: "/images/teachers/teacher2.jpg"
        },
        {
          id: 3,
          name: "Mr. Aman Singh",
          subject: "English Teacher",
          image_url: "/images/teachers/teacher3.jpg"
        }
      ]);
    }
  };

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
          {teachers.map((teacher) => (
            <div key={teacher.id} className="bg-white shadow-lg rounded-xl p-6 text-center">
              <img
                src={teacher.image_url || "/images/teachers/default.jpg"}
                alt={teacher.name}
                className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
                onError={(e) => {
                  e.target.src = "/images/teachers/default.jpg";
                }}
              />
              <h3 className="font-semibold text-blue-700">{teacher.name}</h3>
              <p className="text-gray-500">{teacher.subject}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
