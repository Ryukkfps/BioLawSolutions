'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CarouselManagement() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    ctaText: '',
    order: 1,
    isActive: true
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleFileUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setFormData(prev => ({ ...prev, image: result.filePath }));
        return result.filePath;
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
        return null;
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload image. Please try again.');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/carousel');
      const data = await response.json();
      setSlides(data);
    } catch (error) {
      console.error('Error fetching slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that an image is provided
    if (!formData.image.trim()) {
      alert('Please upload an image or provide an image URL.');
      return;
    }
    
    try {
      const method = editingSlide ? 'PUT' : 'POST';
      const url = editingSlide ? `/api/carousel/${editingSlide.id}` : '/api/carousel';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchSlides();
        setShowForm(false);
        setEditingSlide(null);
        setFormData({
          title: '',
          subtitle: '',
          description: '',
          image: '',
          ctaText: '',
          order: 1,
          isActive: true
        });
      } else {
        const errorData = await response.json();
        alert(`Failed to save slide: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving slide:', error);
      alert('An error occurred while saving the slide.');
    }
  };

  const handleEdit = (slide: CarouselSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      image: slide.image,
      ctaText: slide.ctaText,
      order: slide.order,
      isActive: slide.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this slide?')) {
      setDeletingId(id);
      try {
        console.log('Deleting slide with ID:', id);
        const response = await fetch(`/api/carousel/${id}`, {
          method: 'DELETE',
        });
        
        console.log('Delete response status:', response.status);
        
        if (response.ok) {
          const result = await response.json();
          console.log('Delete result:', result);
          // Remove the slide from local state immediately for better UX
          setSlides(prevSlides => prevSlides.filter(slide => slide.id !== id));
          // Then refresh from server to ensure consistency
          await fetchSlides();
          console.log('Slides refreshed after delete');
        } else {
          const errorData = await response.json();
          console.error('Delete failed:', errorData);
          alert('Failed to delete slide. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting slide:', error);
        alert('An error occurred while deleting the slide.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d66] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading slides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-serif text-[#004d66] uppercase tracking-widest mt-2">
                Carousel Management
              </h1>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingSlide(null);
                setFormData({
                  title: '',
                  subtitle: '',
                  description: '',
                  image: '',
                  ctaText: '',
                  order: slides.length + 1,
                  isActive: true
                });
              }}
              className="bg-[#004d66] text-white px-4 py-2 text-sm font-medium hover:bg-[#003d52] transition-colors rounded"
            >
              Add New Slide
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingSlide ? 'Edit Slide' : 'Add New Slide'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-[#004d66] focus:border-[#004d66] text-gray-900 placeholder-gray-600"
                      placeholder="Enter slide title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                    <input
                      type="text"
                      required
                      value={formData.subtitle}
                      onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-[#004d66] focus:border-[#004d66] text-gray-900 placeholder-gray-600"
                      placeholder="Enter slide subtitle"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-[#004d66] focus:border-[#004d66] text-gray-900 placeholder-gray-600"
                      placeholder="Enter slide description"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <div className="mt-1 space-y-3">
                      {/* File Upload */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Upload new image (JPG, PNG, GIF, WebP - Max 5MB)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              await handleFileUpload(file);
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#004d66] file:text-white hover:file:bg-[#003d52]"
                          disabled={uploadingImage}
                        />
                        {uploadingImage && (
                          <p className="text-sm text-blue-600 mt-1">Uploading image...</p>
                        )}
                      </div>
                      
                      {/* Manual URL Input */}
                      <div className="text-center text-sm text-gray-500">or</div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Enter image URL manually</label>
                        <input
                          type="text"
                          value={formData.image}
                          onChange={(e) => setFormData({...formData, image: e.target.value})}
                          className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-[#004d66] focus:border-[#004d66] text-gray-900 placeholder-gray-600"
                          placeholder="/path/to/image.jpg or https://example.com/image.jpg"
                        />
                      </div>
                      
                      {/* Image Preview */}
                      {formData.image && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-2">Preview:</p>
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="h-20 w-32 object-cover rounded border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/bio-law-solutions.svg';
                            }}
                          />
                          <p className="text-xs text-gray-500 mt-1">Path: {formData.image}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CTA Text</label>
                    <input
                      type="text"
                      required
                      value={formData.ctaText}
                      onChange={(e) => setFormData({...formData, ctaText: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-[#004d66] focus:border-[#004d66] text-gray-900 placeholder-gray-600"
                      placeholder="Learn More"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Order</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.order}
                        onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-[#004d66] focus:border-[#004d66] text-gray-900"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        value={formData.isActive ? 'active' : 'inactive'}
                        onChange={(e) => setFormData({...formData, isActive: e.target.value === 'active'})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-[#004d66] focus:border-[#004d66] text-gray-900"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-[#004d66] hover:bg-[#003d52] rounded transition-colors"
                    >
                      {editingSlide ? 'Update' : 'Create'} Slide
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Slides List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Carousel Slides ({slides.length})
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage the homepage carousel slides
            </p>
          </div>
          
          {slides.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No slides found. Create your first slide!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {slides.map((slide) => (
                <li key={slide.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="shrink-0 h-16 w-24 bg-gray-200 rounded overflow-hidden">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/bio-law-solutions.svg';
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">{slide.title}</p>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            slide.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {slide.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{slide.subtitle}</p>
                        <p className="text-xs text-gray-400 mt-1">Order: {slide.order}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(slide)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(slide.id)}
                        disabled={deletingId === slide.id}
                        className={`text-sm font-medium ${
                          deletingId === slide.id 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-red-600 hover:text-red-900'
                        }`}
                      >
                        {deletingId === slide.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}