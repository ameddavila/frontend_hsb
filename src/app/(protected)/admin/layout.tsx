import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-wrapper">
      {children}
    </div>
  );
}
