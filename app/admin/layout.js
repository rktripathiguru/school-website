"use client";

import { useEffect } from "react";

export default function AdminLayout({ children }) {
  useEffect(() => {
    const handleUnload = () => {
      navigator.sendBeacon("/api/admin/logout");
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return <>{children}</>;
}
