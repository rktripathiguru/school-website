import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-800 text-white px-8 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">U. M. S. Jevari</h1>

      <div className="space-x-6">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/admissions">Admissions</Link>
        <Link href="/notices">Notices</Link>
        <Link href="/gallery">Gallery</Link>
      </div>
    </nav>
  );
}
