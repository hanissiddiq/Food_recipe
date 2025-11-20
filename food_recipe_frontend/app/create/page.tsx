'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/api';

export default function CreateRecipe() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(e: any) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', title);
    fd.append('ingredients', ingredients);
    fd.append('steps', steps);
    if (image) fd.append('image', image);

    setSaving(true);
    const res = await fetch(`${API_BASE}/api/recipes`, { method: 'POST', body: fd });
    if (!res.ok) {
      alert('Gagal menyimpan');
      setSaving(false);
      return;
    }
    router.push('/');
  }

  return (
    <div className="px-2 py-6">
      <h2 className="text-xl font-semibold mb-4">Tambah Resep</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block mb-1">Judul</label>
          <input className="w-full border p-2 rounded" value={title} onChange={e=>setTitle(e.target.value)} required />
        </div>

        <div>
          <label className="block mb-1">Bahan</label>
          <textarea className="w-full border p-2 rounded" rows={4} value={ingredients} onChange={e=>setIngredients(e.target.value)} required />
        </div>

        <div>
          <label className="block mb-1">Langkah</label>
          <textarea className="w-full border p-2 rounded" rows={6} value={steps} onChange={e=>setSteps(e.target.value)} required />
        </div>

        <div>
          <label className="block mb-1">Gambar</label>
          <input type="file" onChange={e=>setImage(e.target.files?.[0] || null)} />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Back
          </button>

          <button
            type="submit"
            className="bg-emerald-600 text-white px-4 py-2 rounded"
            disabled={saving}
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
}
