import Image from "next/image";
import Link from "next/link";
import NoticeTicker from "@/components/NoticeTicker";
import MathHeroBackground from "@/components/MathHeroBackground";
import MathHeroSlideshow from "@/components/MathHeroSlideshow";
import MathRainEffect from "@/components/MathRainEffect";

export default function Home() {
  return (
    <div>

      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">

        <MathHeroSlideshow />
        <MathRainEffect />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl font-bold text-blue-900">
            Welcome to Upgraded Middle School Jevari
          </h1>

          <p className="mt-6 text-xl text-gray-700">
            Empowering Students Through Knowledge
          </p>

          <Link href="/admissions">
            <button className="mt-8 bg-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Apply Now
            </button>
          </Link>
        </div>
      </div>

      {/* Notice Ticker */}
      <NoticeTicker />
      {/* Principal Section */}
      <div className="px-8 py-20">
        <div className="flex gap-4 items-start">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">
              Message from the Principal
            </h2>

            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
              <div className="flex flex-col items-center">
                <img
                  src="/images/principal.jpg"
                  alt="Principal"
                  className="w-80 h-80 object-cover rounded-full mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Rajendra Prasad
                </h3>
              </div>

              <p className="text-gray-600 leading-relaxed">
                Welcome to our school. We are committed to providing quality education
                and nurturing students to become responsible citizens. Our mission is
                to create a supportive learning environment where every child can grow
                academically and personally.
              </p>
            </div>
          </div>

          <div className="flex-1 flex justify-center items-center">
            <div className="relative w-full h-96 max-w-2xl">
              <svg viewBox="0 0 400 300" className="w-full h-full">
                {/* Flower stem */}
                <path
                  d="M200 280 Q200 220 200 150"
                  stroke="#4a5568"
                  strokeWidth="4"
                  fill="none"
                />

                {/* Leaves */}
                <ellipse cx="170" cy="220" rx="25" ry="12" fill="#68d391" transform="rotate(-30 170 220)" />
                <ellipse cx="230" cy="200" rx="25" ry="12" fill="#68d391" transform="rotate(30 230 200)" />
                <ellipse cx="180" cy="240" rx="20" ry="10" fill="#68d391" transform="rotate(-45 180 240)" />

                {/* Flower petals */}
                <g transform="translate(200, 120)">
                  {/* Center circle */}
                  <circle cx="0" cy="0" r="20" fill="#fbbf24" />

                  {/* Petals */}
                  <ellipse cx="0" cy="-35" rx="12" ry="35" fill="#f472b6" opacity="0.8" />
                  <ellipse cx="0" cy="-35" rx="12" ry="35" fill="#f472b6" opacity="0.8" transform="rotate(45)" />
                  <ellipse cx="0" cy="-35" rx="12" ry="35" fill="#f472b6" opacity="0.8" transform="rotate(90)" />
                  <ellipse cx="0" cy="-35" rx="12" ry="35" fill="#f472b6" opacity="0.8" transform="rotate(135)" />
                  <ellipse cx="0" cy="-35" rx="12" ry="35" fill="#f472b6" opacity="0.8" transform="rotate(180)" />
                  <ellipse cx="0" cy="-35" rx="12" ry="35" fill="#f472b6" opacity="0.8" transform="rotate(225)" />
                  <ellipse cx="0" cy="-35" rx="12" ry="35" fill="#f472b6" opacity="0.8" transform="rotate(270)" />
                  <ellipse cx="0" cy="-35" rx="12" ry="35" fill="#f472b6" opacity="0.8" transform="rotate(315)" />
                </g>

                {/* Additional decorative elements */}
                <circle cx="80" cy="80" r="3" fill="#e0e7ff" opacity="0.6" />
                <circle cx="320" cy="90" r="4" fill="#e0e7ff" opacity="0.5" />
                <circle cx="60" cy="180" r="3" fill="#e0e7ff" opacity="0.7" />
                <circle cx="340" cy="200" r="3.5" fill="#e0e7ff" opacity="0.6" />
                <circle cx="100" cy="250" r="2.5" fill="#e0e7ff" opacity="0.5" />
                <circle cx="300" cy="260" r="3" fill="#e0e7ff" opacity="0.6" />

                {/* Small decorative flowers */}
                <g transform="translate(100, 100)">
                  <circle cx="0" cy="0" r="8" fill="#f9a8d4" opacity="0.6" />
                  <circle cx="-8" cy="0" r="4" fill="#f9a8d4" opacity="0.4" />
                  <circle cx="8" cy="0" r="4" fill="#f9a8d4" opacity="0.4" />
                  <circle cx="0" cy="-8" r="4" fill="#f9a8d4" opacity="0.4" />
                  <circle cx="0" cy="8" r="4" fill="#f9a8d4" opacity="0.4" />
                </g>

                <g transform="translate(300, 150)">
                  <circle cx="0" cy="0" r="6" fill="#c084fc" opacity="0.6" />
                  <circle cx="-6" cy="0" r="3" fill="#c084fc" opacity="0.4" />
                  <circle cx="6" cy="0" r="3" fill="#c084fc" opacity="0.4" />
                  <circle cx="0" cy="-6" r="3" fill="#c084fc" opacity="0.4" />
                  <circle cx="0" cy="6" r="3" fill="#c084fc" opacity="0.4" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
