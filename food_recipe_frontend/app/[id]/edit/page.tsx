"use client";

import React, { useEffect, useRef, useState } from "react";
import { API_BASE } from "@/lib/api";
import { useRouter, useParams } from "next/navigation";

type Recipe = {
  id: number | string;
  title: string;
  ingredients: string;
  steps: string;
  image_url?: string | null;
};

export default function EditRecipe(): JSX.Element {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [title, setTitle] = useState<string>("");
  const [ingredients, setIngredients] = useState<string>("");
  const [steps, setSteps] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  async function loadRecipe(): Promise<void> {
    if (!id) {
      setError("Invalid recipe id");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/api/recipes/${id}`);
      if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
      const data: Recipe = await res.json();
      setRecipe(data);
      setTitle(data.title ?? "");
      setIngredients(data.ingredients ?? "");
      setSteps(data.steps ?? "");
      // set initial preview to existing image
      setPreview(data.image_url ?? null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecipe();
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function setFileAndPreview(f: File | null) {
    // revoke old blob preview if any
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    if (!f) {
      // if removing selected new file, fallback to original image_url (if any)
      setFile(null);
      setPreview(recipe?.image_url ?? null);
      return;
    }
    const url = URL.createObjectURL(f);
    setFile(f);
    setPreview(url);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFileAndPreview(f);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0] ?? null;
    if (f && f.type.startsWith("image/")) setFileAndPreview(f);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!id) return;
    const form = new FormData();
    form.append("_method", "PUT"); // keep compatibility if backend expects method override
    form.append("title", title);
    form.append("ingredients", ingredients);
    form.append("steps", steps);
    if (file) form.append("image", file);

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/recipes/${id}`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Update failed: ${res.status}`);
      }
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert("Gagal update: " + msg);
    } finally {
      setLoading(false);
    }
  }

  if (loading && !recipe) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!recipe) return <div className="p-6">Data resep tidak ditemukan.</div>;

  return (
    <div className="min-h-screen px-4 py-6 flex items-start justify-center bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-5 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Edit Resep</h1>
          {/* <button
            onClick={() => router.back()}
            className="text-sm px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Kembali
          </button> */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
            <input
              type="text"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bahan</label>
            <textarea
              value={ingredients}
              required
              onChange={(e) => setIngredients(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Langkah</label>
            <textarea
              value={steps}
              required
              onChange={(e) => setSteps(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gambar</label>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative w-full h-44 border-2 border-dashed rounded-lg overflow-hidden transition-colors ${
                dragOver ? "border-indigo-400 bg-indigo-50" : "border-gray-200 bg-white"
              }`}
            >
              {/* preview area */}
              {preview ? (
                <div className="w-full h-full relative">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFileAndPreview(null);
                        // clear file input value
                        if (inputRef.current) inputRef.current.value = "";
                      }}
                      className="bg-white/90 text-red-600 rounded-full p-2 shadow hover:bg-white"
                      aria-label="Hapus gambar"
                    >
                      ✕
                    </button>
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      className="bg-white/90 text-gray-800 rounded-full p-2 shadow hover:bg-white"
                      aria-label="Ganti gambar"
                    >
                      ✎
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M7 16V8a4 4 0 014-4h2a4 4 0 014 4v8m-6 0h.01" />
                    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 12v6" />
                  </svg>
                  <div className="text-sm font-medium">Tarik & lepas gambar di sini</div>
                  <div className="text-xs mt-1 text-gray-400">Atau klik untuk memilih file (jpg/png/webp)</div>
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="mt-3 px-3 py-1 bg-indigo-600 text-white rounded-md text-sm"
                  >
                    Pilih Gambar
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

            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <div>{file ? `${file.name} • ${(file.size / 1024 / 1024).toFixed(2)} MB` : (recipe?.image_url ? "Menggunakan gambar saat ini" : "Belum ada gambar")}</div>
              <div>Max 5MB</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* <button
            onClick={() => router.back()}
            className="text-sm px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Kembali
          </button> */}

          <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-sm hover:bg-gray-600"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="ml-auto px-4 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? "Menyimpan..." : "Update Resep"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
