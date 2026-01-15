'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AboutSection {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  image: string;
  layout: 'NORMAL' | 'MIRRORED';
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AboutManagement() {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState<AboutSection | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    image: '',
    layout: 'NORMAL' as 'NORMAL' | 'MIRRORED',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchSections();
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

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/about');
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image.trim()) {
      alert('Please upload an image or provide an image URL.');
      return;
    }
    
    try {
      const method = editingSection ? 'PUT' : 'POST';
      const url = editingSection ? `/api/about/${editingSection.id}` : '/api/about';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchSections();
        setShowForm(false);
        setEditingSection(null);
        setFormData({
          title: '',
          subtitle: '',
          content: '',
          image: '',
          layout: 'NORMAL',
          order: 0,
          isActive: true
        });
      } else {
        const errorData = await response.json();
        alert(`Failed to save section: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving section:', error);
      alert('An error occurred while saving the section.');
    }
  };

  const handleEdit = (section: AboutSection) => {
    setEditingSection(section);
    setFormData({
      title: section.title,
      subtitle: section.subtitle || '',
      content: section.content,
      image: section.image,
      layout: section.layout,
      order: section.order,
      isActive: section.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      setDeletingId(id);
      try {
        const response = await fetch(`/api/about/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setSections(prev => prev.filter(s => s.id !== id));
        } else {
          alert('Failed to delete section.');
        }
      } catch (error) {
        console.error('Error deleting section:', error);
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
          <p className="mt-4 text-gray-600">Loading sections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-serif text-[#004d66] uppercase tracking-widest mt-2">
                About Section Management
              </h1>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingSection(null);
                setFormData({
                  title: '',
                  subtitle: '',
                  content: '',
                  image: '',
                  layout: 'NORMAL',
                  order: sections.length,
                  isActive: true
                });
              }}
              className="bg-[#004d66] text-white px-4 py-2 text-sm font-medium hover:bg-[#003d52] transition-colors rounded"
            >
              Add New Section
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingSection ? 'Edit Section' : 'Add New Section'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subtitle (e.g. MEET OUR FOUNDER)</label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Content (Use new lines for paragraphs)</label>
                    <textarea
                      required
                      rows={6}
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Layout Style</label>
                    <select
                      value={formData.layout}
                      onChange={(e) => setFormData({...formData, layout: e.target.value as 'NORMAL' | 'MIRRORED'})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900"
                    >
                      <option value="NORMAL">Normal (Image Left, Text Right)</option>
                      <option value="MIRRORED">Mirrored (Image Right, Text Left)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <div className="mt-1 space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) await handleFileUpload(file);
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#004d66] file:text-white"
                        disabled={uploadingImage}
                      />
                      {formData.image && (
                        <img src={formData.image} alt="Preview" className="h-32 w-auto object-cover rounded border" />
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Order</label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        value={formData.isActive ? 'active' : 'inactive'}
                        onChange={(e) => setFormData({...formData, isActive: e.target.value === 'active'})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900"
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
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-[#004d66] hover:bg-[#003d52] rounded"
                    >
                      {editingSection ? 'Update' : 'Create'} Section
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {sections.map((section) => (
              <li key={section.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="shrink-0 h-20 w-32 bg-gray-200 rounded overflow-hidden">
                      <img src={section.image} alt={section.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">{section.title}</h4>
                      <p className="text-sm text-gray-500">
                        Layout: {section.layout} | Order: {section.order} | {section.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(section)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(section.id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                      disabled={deletingId === section.id}
                    >
                      {deletingId === section.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </li>
            ))}
            {sections.length === 0 && (
              <li className="px-4 py-12 text-center text-gray-500">
                No sections found. Add your first About section!
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
