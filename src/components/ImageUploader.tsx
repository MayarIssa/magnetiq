"use client";

import { useRef, useState } from "react";

interface ImageUploaderProps {
  label?: string;
  value: string | null;
  onChange: (url: string | null) => void;
  shape?: "magnet" | "card";
}

export function ImageUploader({ label, value, onChange, shape = "magnet" }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image is too large (max 10MB).");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      onChange(data.url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  const frameClass =
    shape === "card"
      ? "aspect-[3/4] w-40 rounded-lg"
      : "aspect-square w-40 rounded-xl";

  return (
    <div className="flex flex-col items-center gap-2">
      {label && <p className="text-sm font-medium text-stone-700">{label}</p>}
      <div
        className={`relative ${frameClass} flex cursor-pointer items-center justify-center overflow-hidden border-2 border-dashed border-brand/40 bg-brand-cream transition hover:border-brand`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
      >
        {value ? (
          <img src={value} alt="Uploaded photo" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="px-3 text-center text-xs text-stone-500">
            {uploading ? "Uploading..." : "Click or drop your photo here"}
          </div>
        )}
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white"
            aria-label="Remove photo"
          >
            ✕
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
