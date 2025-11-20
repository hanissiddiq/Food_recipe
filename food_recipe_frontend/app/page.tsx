'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/api';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/recipes`, { cache: 'no-store' });
    const data = await res.json();
    setRecipes(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function remove(id: number) {
    if (!confirm('Hapus resep?')) return;
    await fetch(`${API_BASE}/api/recipes/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="px-2 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Resep</h2>
        <Link href="/create" className="bg-indigo-600 text-white px-4 py-2 rounded">Tambah Resep</Link>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recipes.map(r => (
            <div key={r.id} className="card">
              {r.image_url && <img src={r.image_url} className="w-full h-44 object-cover rounded mb-3" />}
              <h3 className="text-lg font-bold">{r.title}</h3>
              <p className="text-sm mt-2 line-clamp-3">{r.ingredients}</p>
              <div className="mt-4 flex gap-2">
                <Link href={`/${r.id}/edit`} className="px-3 py-1 bg-yellow-400 rounded">Edit</Link>
                <button onClick={() => remove(r.id)} className="px-3 py-1 bg-red-500 text-white rounded">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
