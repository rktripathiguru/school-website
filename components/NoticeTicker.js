"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function NoticeTicker() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    const res = await fetch("/api/notices");
    const data = await res.json();
    setNotices(data);
  };

  return (
    <div className="ticker-wrapper bg-blue-700 text-white py-3">
      <div className="ticker-track">
        {[...notices, ...notices].map((notice, index) => (
          <Link key={index} href="/notices">
            <span className="ticker-item">
              📢 {notice.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
