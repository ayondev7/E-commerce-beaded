"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { labelClass } from "./InputField";

interface FileDropFieldProps {
  label?: string;
  onFilesChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

const baseDropClass =
  "w-full mt-2 px-4 py-[11px] text-xl leading-[30px] bg-white border-2 border-dashed border-[#B7B7B7] rounded-none focus:outline-none";

const FileDropField: React.FC<FileDropFieldProps> = ({
  label,
  onFilesChange,
  accept = "image/*",
  multiple = false,
  className,
}) => {
  const [isOver, setIsOver] = React.useState(false);
  const [fileNames, setFileNames] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files);
    setFileNames(list.map((f) => f.name));
    onFilesChange?.(list);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const onBrowse = () => inputRef.current?.click();

  return (
    <div className={cn(className)}>
      {label && <label className={labelClass}>{label}</label>}
      <div
        className={cn(
          baseDropClass,
          "cursor-pointer text-[#7D7D7D] flex items-center justify-between gap-3",
          isOver && "bg-gray-50"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsOver(true);
        }}
        onDragLeave={() => setIsOver(false)}
        onDrop={onDrop}
        onClick={onBrowse}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onBrowse();
        }}
      >
        <span className="truncate">
          {fileNames.length > 0
            ? fileNames.join(", ")
            : "Drag & drop to upload images"}
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
};

export default FileDropField;
