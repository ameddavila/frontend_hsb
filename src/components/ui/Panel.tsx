"use client";
import React from "react";

interface PanelProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Panel({ title, icon, children, className = "" }: PanelProps) {
  return (
    <div className={`surface-card p-4 border-round shadow-2 mb-4 ${className}`}>
      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-primary">
        {icon && <i className={`${icon}`} />} {title}
      </h3>
      {children}
    </div>
  );
}
