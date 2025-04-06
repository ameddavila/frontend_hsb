"use client";
import { Card } from "primereact/card";

interface Props {
  title: string;
  icon?: string;
  children: React.ReactNode;
}

export default function FormContainer({ title, icon, children }: Props) {
  return (
    <Card className="w-full max-w-4xl mx-auto mb-6 border-round-lg shadow-md surface-card">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-bottom-1 pb-3 mb-2 text-primary">
          {icon && <i className={`${icon} text-2xl`} />}
          <h2 className="text-2xl font-semibold">{title}</h2>
        </div>
        <div className="px-2 md:px-4">{children}</div>
      </div>
    </Card>
  );
}
