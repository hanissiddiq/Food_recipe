"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";

export default function CreateRecipe(): JSX.Element {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [ingredients, setIngredients] = useState<string>("");
  const [steps, setSteps] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function setImageFile(file: File | null) {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    if (!file) {
      setImage(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setImage(file);
    setPreview(url);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setImageFile(f);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0] ?? null;
    if (f && f.type.startsWith("image/")) setImageFile(f);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", title);
    fd.append("ingredients", ingredients);
    fd.append("steps", steps);
    if (image) fd.append("image", image);

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/recipes`, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Gagal menyimpan");
      router.push("/");
    } catch (err) {
      alert((err instanceof Error && err.message) || "Gagal menyimpan");
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 py-8 px-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 sm:p-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Tambah Resep</h2>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Masukkan judul resep"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bahan</label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              rows={4}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Daftar bahan..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Langkah</label>
            <textarea
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              rows={6}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Langkah-langkah memasak..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gambar (opsional)</label>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative flex items-center justify-center w-full h-40 border-2 border-dashed rounded-lg p-3 transition-colors ${
                dragOver ? "border-indigo-400 bg-indigo-50" : "border-gray-200 bg-white"
              }`}
            >
              {!preview ? (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex flex-col items-center gap-2 text-center text-sm text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V8a4 4 0 014-4h2a4 4 0 014 4v8m-6 0h.01" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12v6" />
                  </svg>
                  <span>Tarik & lepas gambar di sini,<br/>atau klik untuk pilih file</span>
                </button>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={preview}
                    alt="preview"
                    className="object-cover rounded-lg w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => setImageFile(null)}
                    className="absolute top-2 right-2 bg-white/80 text-red-600 rounded-full p-1 shadow hover:bg-white"
                    aria-label="Hapus gambar"
                  >
                    ✕
                  </button>
                </div>
              )}

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <p className="mt-2 text-xs text-gray-500">Maks 5MB. Format: jpg, png, webp.</p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-sm hover:bg-gray-600"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={saving}
              className="ml-auto px-5 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
