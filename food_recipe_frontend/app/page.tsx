"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/lib/api";

type Recipe = {
  id: number | string;
  title: string;
  ingredients?: string | null;
  image_url?: string | null;
};

export default function RecipesPage(): JSX.Element {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  async function load(signal?: AbortSignal) {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/recipes`, { cache: "no-store", signal });
      if (!res.ok) throw new Error("Gagal memuat resep");
      const data = await res.json();
      setRecipes(Array.isArray(data) ? data : []);
    } catch (err) {
      if ((err as any)?.name !== "AbortError") console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const ac = new AbortController();
    load(ac.signal);
    return () => ac.abort();
  }, []);

  async function remove(id: number) {
    if (!confirm("Hapus resep?")) return;
    try {
      setDeleting(id);
      // optimistic UI
      setRecipes((prev) => prev.filter((r) => Number(r.id) !== id));
      const res = await fetch(`${API_BASE}/api/recipes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
    } catch (err) {
      alert("Gagal menghapus resep.");
      load();
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Resep</h2>
          <p className="text-sm text-gray-500 mt-1">Koleksi resep Anda — ketuk gambar untuk lihat penuh.</p>
        </div>

        <div className="flex gap-3 items-center w-full sm:w-auto">
          <Link
            href="/create"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Tambah Resep
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg p-4 shadow">
              <div className="bg-gray-200 h-40 rounded mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">Belum ada resep.</p>
          <Link href="/create" className="inline-block bg-emerald-600 text-white px-4 py-2 rounded-lg">
            Buat Resep Pertama
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((r) => (
            <article
              key={String(r.id)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1 p-4 flex flex-col"
            >
              <div className="relative mb-3">
                {r.image_url ? (
                  <button
                    type="button"
                    onClick={() => setModalImage(r.image_url!)}
                    className="w-full h-44 overflow-hidden rounded-lg focus:outline-none"
                    aria-label={`Lihat gambar ${r.title}`}
                  >
                    <img
                      src={r.image_url}
                      alt={r.title}
                      className="w-full h-44 object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </button>
                ) : (
                  <div className="w-full h-44 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    <span>No Image</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/80 px-2 py-1 rounded text-xs text-gray-700 shadow">
                  Resep
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{r.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">{r.ingredients}</p>

              <div className="mt-auto flex items-center gap-2">
                <Link
                  href={`/${r.id}/edit`}
                  className="px-3 py-1 bg-yellow-400 rounded-md text-sm hover:brightness-95"
                >
                  Edit
                </Link>
                <button
                  onClick={() => remove(Number(r.id))}
                  disabled={deleting === Number(r.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md text-sm disabled:opacity-60"
                >
                  {deleting === Number(r.id) ? "Menghapus..." : "Hapus"}
                </button>
                <Link href={`/${r.id}`} className="ml-auto px-3 py-1 bg-gray-100 rounded-md text-sm">
                  Detail
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setModalImage(null)}
        >
          <div className="max-w-3xl w-full rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img src={modalImage} alt="preview" className="w-full max-h-[80vh] object-contain bg-black" />
            <div className="p-3 flex justify-end">
              <button
                onClick={() => setModalImage(null)}
                className="px-3 py-2 bg-white rounded-md shadow"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
