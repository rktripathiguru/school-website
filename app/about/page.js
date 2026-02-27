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
          subject: "Mathematics",
          email: "ritesh.tiwari@umsjevari.edu",
          phone: "9876543210",
          bio: "Experienced mathematics teacher with expertise in algebra and geometry.",
          experience_years: 15,
          qualification: "M.Sc. Mathematics",
          image_url: "/images/teachers/default.svg"
        },
        {
          id: 2,
          name: "Mrs. Sita Devi",
          subject: "Science",
          email: "sita.devi@umsjevari.edu",
          phone: "9876543211",
          bio: "Dedicated science teacher specializing in physics and chemistry.",
          experience_years: 12,
          qualification: "M.Sc. Physics",
          image_url: "/images/teachers/default.svg"
        },
        {
          id: 3,
          name: "Mr. Aman Singh",
          subject: "English",
          email: "aman.singh@umsjevari.edu",
          phone: "9876543212",
          bio: "Creative English teacher with strong background in literature.",
          experience_years: 10,
          qualification: "M.A. English",
          image_url: "/images/teachers/default.svg"
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
            <div key={teacher.id} className="bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition-shadow">
              <img
                src={teacher.image_url || "/images/teachers/default.svg"}
                alt={teacher.name}
                className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-4 border-blue-100"
                onError={(e) => {
                  e.target.src = "/images/teachers/default.svg";
                }}
              />
              <h3 className="font-semibold text-blue-700 text-lg mb-2">{teacher.name}</h3>
              <p className="text-gray-600 mb-3">{teacher.subject}</p>
              
              {teacher.qualification && (
                <p className="text-sm text-gray-500 mb-2">{teacher.qualification}</p>
              )}
              
              {teacher.experience_years && (
                <p className="text-sm text-gray-500 mb-3">{teacher.experience_years} years experience</p>
              )}
              
              {teacher.email && (
                <p className="text-xs text-gray-400 mb-1">{teacher.email}</p>
              )}
              
              {teacher.phone && (
                <p className="text-xs text-gray-400">{teacher.phone}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
