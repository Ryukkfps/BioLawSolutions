'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Image as ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';

interface ContentSection {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  backgroundImage: string;
  ctaText: string | null;
  ctaLink: string | null;
  textColor: string;
  overlayOpacity: number;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminContent() {
  const [content, setContent] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentSection | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    backgroundImage: '',
    ctaText: '',
    ctaLink: '',
    textColor: 'white',
    overlayOpacity: 0.5,
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content?admin=true');
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.description) {
      alert('Title and description are required');
      return;
    }
    
    if (!formData.backgroundImage) {
      alert('Background image is required. Please upload an image or enter a URL.');
      return;
    }
    
    setActionLoading('form');

    try {
      const method = editingContent ? 'PUT' : 'POST';
      const url = editingContent ? `/api/content/${editingContent.id}` : '/api/content';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchContent();
        setShowForm(false);
        setEditingContent(null);
        resetForm();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error saving content section');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (contentSection: ContentSection) => {
    setEditingContent(contentSection);
    setFormData({
      title: contentSection.title,
      subtitle: contentSection.subtitle || '',
      description: contentSection.description,
      backgroundImage: contentSection.backgroundImage,
      ctaText: contentSection.ctaText || '',
      ctaLink: contentSection.ctaLink || '',
      textColor: contentSection.textColor,
      overlayOpacity: contentSection.overlayOpacity,
      order: contentSection.order,
      isActive: contentSection.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content section?')) {
      return;
    }

    setActionLoading(contentId);
    try {
      const response = await fetch(`/api/content/${contentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchContent();
      } else {
        alert('Error deleting content section');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Error deleting content section');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (contentId: string, currentStatus: boolean) => {
    setActionLoading(contentId);
    try {
      const contentSection = content.find(c => c.id === contentId);
      if (!contentSection) return;

      const response = await fetch(`/api/content/${contentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...contentSection,
          isActive: !currentStatus,
        }),
      });

      if (response.ok) {
        await fetchContent();
      }
    } catch (error) {
      console.error('Error toggling content status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      backgroundImage: '',
      ctaText: '',
      ctaLink: '',
      textColor: 'white',
      overlayOpacity: 0.5,
      order: content.length + 1,
      isActive: true,
    });
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

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d66] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading content sections...</p>
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
              Content Management
            </h1>
            <p className="text-gray-600">
              Manage full-screen content sections for your homepage
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingContent(null);
              setShowForm(true);
            }}
            className="flex items-center px-4 py-2 bg-[#004d66] text-white text-sm font-medium rounded-md hover:bg-[#003d52] transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Content Section
          </button>
        </div>

        {/* Content List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Content Sections</h2>
            <p className="text-sm text-gray-500 mt-1">
              {content.length} section{content.length !== 1 ? 's' : ''} • Drag to reorder
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {content.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No content sections found</p>
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="mt-2 text-[#004d66] hover:underline text-sm"
                >
                  Create your first content section
                </button>
              </div>
            ) : (
              content.map((section) => (
                <div key={section.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{section.title}</h3>
                        {section.subtitle && (
                          <span className="text-sm text-gray-500">• {section.subtitle}</span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          section.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {section.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-xs text-gray-400">Order: {section.order}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {section.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span>Background: {section.backgroundImage}</span>
                        <span>Text: {section.textColor}</span>
                        <span>Overlay: {Math.round(section.overlayOpacity * 100)}%</span>
                        {section.ctaText && <span>CTA: {section.ctaText}</span>}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleToggleActive(section.id, section.isActive)}
                        disabled={actionLoading === section.id}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title={section.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {section.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      
                      <button
                        onClick={() => handleEdit(section)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(section.id)}
                        disabled={actionLoading === section.id}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        {actionLoading === section.id ? (
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
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingContent ? 'Edit Content Section' : 'Add Content Section'}
                </h3>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Help Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Background Image Tips</h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Upload images directly or use URLs from external sources</li>
                    <li>• Recommended size: 1920x1080 pixels or larger for best quality</li>
                    <li>• Supported formats: JPG, PNG, GIF, WebP (max 5MB)</li>
                    <li>• Use high-contrast images for better text readability</li>
                  </ul>
                </div>

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
                      placeholder="Section title"
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
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d66] focus:border-transparent text-gray-900 placeholder-gray-600"
                    placeholder="Section description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Image *
                  </label>
                  <div className="space-y-3">
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
                        value={formData.backgroundImage}
                        onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d66] focus:border-transparent text-gray-900 placeholder-gray-600"
                        placeholder="/path/to/image.jpg or https://example.com/image.jpg"
                      />
                    </div>
                    
                    {/* Image Preview */}
                    {formData.backgroundImage && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        <img
                          src={formData.backgroundImage}
                          alt="Preview"
                          className="h-20 w-32 object-cover rounded border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiM5OTkiPkltYWdlPC90ZXh0Pjwvc3ZnPg==';
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-1">Path: {formData.backgroundImage}</p>
                      </div>
                    )}
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
                      placeholder="/services or https://example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <span className="text-xs text-gray-500">{Math.round(formData.overlayOpacity * 100)}%</span>
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
                      setEditingContent(null);
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
                    {actionLoading === 'form' ? 'Saving...' : editingContent ? 'Update' : 'Create'}
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