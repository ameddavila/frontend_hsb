"use client";
import { Card } from "primereact/card";

interface Props {
  title: string;
  icon?: string;
  children: React.ReactNode;
}

export default function FormContainer({ title, icon, children }: Props) {
  return (
    <Card className="w-full max-w-4xl mx-auto p-4 mb-4 shadow-2 border-round">
      <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2 text-primary">
        {icon && <i className={icon} />} {title}
      </h2>
      {children}
    </Card>
  );
}
