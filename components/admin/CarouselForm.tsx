'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSlide, updateSlide } from '@/lib/actions/carousel';

export default function CarouselForm({ initialData }: { initialData?: { id?: string; title: string; subtitle: string; description: string; image: string; ctaText: string; isActive: boolean; order: number } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    description: initialData?.description || '',
    image: initialData?.image || '',
    ctaText: initialData?.ctaText || 'Learn More',
    isActive: initialData?.isActive ?? true,
    order: initialData?.order || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData?.id) {
        await updateSlide(initialData.id, formData);
      } else {
        await createSlide(formData);
      }
      router.push('/admin/carousel');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Error saving slide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Title</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004d66] text-gray-900 placeholder-gray-600"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter slide title"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Subtitle</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004d66] text-gray-900 placeholder-gray-600"
            value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            placeholder="Enter slide subtitle"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description</label>
        <textarea
          rows={3}
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004d66] text-gray-900 placeholder-gray-600"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter slide description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Image URL</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004d66] text-gray-900 placeholder-gray-600"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">CTA Text</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004d66] text-gray-900 placeholder-gray-600"
            value={formData.ctaText}
            onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
            placeholder="Learn More"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 pt-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-[#004d66]"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Is Active</span>
        </label>
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Order</label>
          <input
            type="number"
            className="w-20 px-3 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#004d66] text-gray-900"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="pt-6 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-200 text-gray-600 text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-[#004d66] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#003d52] transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Slide'}
        </button>
      </div>
    </form>
  );
}
