'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Briefcase } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface Sector {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  detailedDescription: string | null;
  backgroundImage: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  textColor: string;
  overlayOpacity: number;
  styleType: string;
  order: number;
  icon: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSectors() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    detailedDescription: '',
    backgroundImage: '',
    ctaText: '',
    ctaLink: '',
    textColor: 'white',
    overlayOpacity: 0.5,
    styleType: 'card',
    order: 0,
    icon: '',
    isActive: true,
  });

  useEffect(() => {
    fetchSectors();
  }, []);

  const fetchSectors = async () => {
    try {
      const response = await fetch('/api/sectors?admin=true');
      if (response.ok) {
        const data = await response.json();
        setSectors(data);
      }
    } catch (error) {
      console.error('Error fetching sectors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      alert('Title and description are required');
      return;
    }
    
    setActionLoading('form');

    try {
      const method = editingSector ? 'PUT' : 'POST';
      const url = editingSector ? `/api/sectors/${editingSector.id}` : '/api/sectors';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchSectors();
        setShowForm(false);
        setEditingSector(null);
        resetForm();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error saving sector:', error);
      alert('Error saving sector');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (sector: Sector) => {
    setEditingSector(sector);
    setFormData({
      title: sector.title,
      subtitle: sector.subtitle || '',
      description: sector.description,
      detailedDescription: sector.detailedDescription || '',
      backgroundImage: sector.backgroundImage || '',
      ctaText: sector.ctaText || '',
      ctaLink: sector.ctaLink || '',
      textColor: sector.textColor,
      overlayOpacity: sector.overlayOpacity,
      styleType: sector.styleType,
      order: sector.order,
      icon: sector.icon || '',
      isActive: sector.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (sectorId: string) => {
    if (!confirm('Are you sure you want to delete this sector?')) {
      return;
    }

    setActionLoading(sectorId);
    try {
      const response = await fetch(`/api/sectors/${sectorId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchSectors();
      } else {
        alert('Error deleting sector');
      }
    } catch (error) {
      console.error('Error deleting sector:', error);
      alert('Error deleting sector');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (sectorId: string, currentStatus: boolean) => {
    setActionLoading(sectorId);
    try {
      const sector = sectors.find(s => s.id === sectorId);
      if (!sector) return;

      const response = await fetch(`/api/sectors/${sectorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...sector,
          isActive: !currentStatus,
        }),
      });

      if (response.ok) {
        await fetchSectors();
      }
    } catch (error) {
      console.error('Error toggling sector status:', error);
    } finally {
      setActionLoading(null);
    }
  };

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
        setFormData(prev => ({ ...prev, backgroundImage: result.filePath }));
      } else {
        const errorData = await response.json();
        alert(`Upload failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    } finally {
      setUploadingImage(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      detailedDescription: '',
      backgroundImage: '',
      ctaText: '',
      ctaLink: '',
      textColor: 'white',
      overlayOpacity: 0.5,
      styleType: 'card',
      order: sectors.length + 1,
      icon: '',
      isActive: true,
    });
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d66] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sectors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif text-[#004d66] uppercase tracking-widest mb-2">
              Sectors Management
            </h1>
            <p className="text-gray-600">
              Manage your industry sectors with two different display styles
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingSector(null);
              setShowForm(true);
            }}
            className="flex items-center px-4 py-2 bg-[#004d66] text-white text-sm font-medium rounded-md hover:bg-[#003d52] transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Sector
          </button>
        </div>

        {/* Sectors List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Sectors</h2>
            <p className="text-sm text-gray-500 mt-1">
              {sectors.length} sector{sectors.length !== 1 ? 's' : ''} • Mix of fullscreen and card styles
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {sectors.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No sectors found</p>
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="mt-2 text-[#004d66] hover:underline text-sm"
                >
                  Create your first sector
                </button>
              </div>
            ) : (
              sectors.map((sector) => (
                <div key={sector.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{sector.title}</h3>
                        {sector.subtitle && (
                          <span className="text-sm text-gray-500">• {sector.subtitle}</span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          sector.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {sector.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          sector.styleType === 'fullscreen'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {sector.styleType === 'fullscreen' ? 'Full Screen' : 'Card Style'}
                        </span>
                        <span className="text-xs text-gray-400">Order: {sector.order}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {sector.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        {sector.backgroundImage && <span>Has Background</span>}
                        <span>Text: {sector.textColor}</span>
                        {sector.ctaText && <span>CTA: {sector.ctaText}</span>}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleToggleActive(sector.id, sector.isActive)}
                        disabled={actionLoading === sector.id}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title={sector.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {sector.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      
                      <button
                        onClick={() => handleEdit(sector)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(sector.id)}
                        disabled={actionLoading === sector.id}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        {actionLoading === sector.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingSector ? 'Edit Sector' : 'Add Sector'}
                </h3>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d66] focus:border-transparent text-gray-900 placeholder-gray-600"
                      placeholder="Sector title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d66] focus:border-transparent text-gray-900 placeholder-gray-600"
                      placeholder="Optional subtitle"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d66] focus:border-transparent text-gray-900 placeholder-gray-600"
                    placeholder="Brief sector description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description (Rich Text)
                  </label>
                  <RichTextEditor
                    value={formData.detailedDescription}
                    onChange={(value) => setFormData({ ...formData, detailedDescription: value })}
                    placeholder="Detailed sector description..."
                  />
                </div>

                {/* Background Image Upload */}
                <div className="pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Image
                  </label>
                  <div className="space-y-3">
                    <div>
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
                    </div>
                    
                    <div>
                      <input
                        type="text"
                        value={formData.backgroundImage}
                        onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d66] focus:border-transparent text-gray-900 placeholder-gray-600"
                        placeholder="Enter image URL"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CTA Text
                    </label>
                    <input
                      type="text"
                      value={formData.ctaText}
                      onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d66] focus:border-transparent text-gray-900 placeholder-gray-600"
                      placeholder="Learn More"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CTA Link
                    </label>
                    <input
                      type="text"
                      value={formData.ctaLink}
                      onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d66] focus:border-transparent text-gray-900 placeholder-gray-600"
                      placeholder="/contact"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Style Type
                    </label>
                    <select
                      value={formData.styleType}
                      onChange={(e) => setFormData({ ...formData, styleType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d66] focus:border-transparent text-gray-900"
                    >
                      <option value="card">Card Style</option>
                      <option value="fullscreen">Full Screen</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Color
                    </label>
                    <select
                      value={formData.textColor}
                      onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d66] focus:border-transparent text-gray-900"
                    >
                      <option value="white">White</option>
                      <option value="black">Black</option>
                      <option value="#004d66">Brand Blue</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Overlay Opacity
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.overlayOpacity}
                      onChange={(e) => setFormData({ ...formData, overlayOpacity: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d66] focus:border-transparent text-gray-900"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#004d66] border-gray-300 rounded focus:ring-[#004d66]"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Active (visible on website)
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingSector(null);
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading === 'form'}
                    className="px-8 py-3 bg-[#004d66] text-white text-sm font-medium rounded-md hover:bg-[#003d52] disabled:opacity-50"
                  >
                    {actionLoading === 'form' ? 'Saving...' : editingSector ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
