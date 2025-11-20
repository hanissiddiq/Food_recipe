'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { API_BASE } from '@/lib/api';

export default function EditRecipe() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await fetch(`${API_BASE}/api/recipes/${id}`);
      const data = await res.json();
      setTitle(data.title);
      setIngredients(data.ingredients);
      setSteps(data.steps);
      setLoading(false);
    })();
  }, [id]);

  async function submit(e: any) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('_method','PUT');
    fd.append('title', title);
    fd.append('ingredients', ingredients);
    fd.append('steps', steps);
    if (image) fd.append('image', image);

    const res = await fetch(`${API_BASE}/api/recipes/${id}`, { method: 'POST', body: fd });
    if (!res.ok) {
      alert('Gagal update');
      return;
    }
    router.push('/');
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="px-2 py-6">
      <h2 className="text-xl font-semibold mb-4">Edit Resep</h2>
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

          <button className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
          
        </div>
        
      </form>
    </div>
  );
}
