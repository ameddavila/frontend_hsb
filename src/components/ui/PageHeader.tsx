"use client";
import { Button } from "primereact/button";

interface Props {
  title: string;
  icon?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

export default function PageHeader({ title, icon, buttonLabel, onButtonClick }: Props) {
  return (
    <div className="flex flex-column md:flex-row justify-between align-items-center mb-4 gap-3">
      <div className="text-2xl font-bold flex items-center gap-2">
        {icon && <i className={icon} />} {title}
      </div>
      {buttonLabel && (
        <Button
          label={buttonLabel}
          icon="pi pi-plus"
          onClick={onButtonClick}
          className="p-button-sm"
        />
      )}
    </div>
  );
}
