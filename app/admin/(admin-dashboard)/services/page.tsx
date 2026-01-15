'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Briefcase } from 'lucide-react';

interface Service {
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

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
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
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services?admin=true');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
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
      const method = editingService ? 'PUT' : 'POST';
      const url = editingService ? `/api/services/${editingService.id}` : '/api/services';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchServices();
        setShowForm(false);
        setEditingService(null);
        resetForm();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Error saving service');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      subtitle: service.subtitle || '',
      description: service.description,
      detailedDescription: service.detailedDescription || '',
      backgroundImage: service.backgroundImage || '',
      ctaText: service.ctaText || '',
      ctaLink: service.ctaLink || '',
      textColor: service.textColor,
      overlayOpacity: service.overlayOpacity,
      styleType: service.styleType,
      order: service.order,
      icon: service.icon || '',
      isActive: service.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }

    setActionLoading(serviceId);
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchServices();
      } else {
        alert('Error deleting service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Error deleting service');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (serviceId: string, currentStatus: boolean) => {
    setActionLoading(serviceId);
    try {
      const service = services.find(s => s.id === serviceId);
      if (!service) return;

      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...service,
          isActive: !currentStatus,
        }),
      });

      if (response.ok) {
        await fetchServices();
      }
    } catch (error) {
      console.error('Error toggling service status:', error);
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
      order: services.length + 1,
      icon: '',
      isActive: true,
    });
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d66] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
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
              Services Management
            </h1>
            <p className="text-gray-600">
              Manage your legal services with two different display styles
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingService(null);
              setShowForm(true);
            }}
            className="flex items-center px-4 py-2 bg-[#004d66] text-white text-sm font-medium rounded-md hover:bg-[#003d52] transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </button>
        </div>

        {/* Services List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Services</h2>
            <p className="text-sm text-gray-500 mt-1">
              {services.length} service{services.length !== 1 ? 's' : ''} • Mix of fullscreen and card styles
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {services.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No services found</p>
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="mt-2 text-[#004d66] hover:underline text-sm"
                >
                  Create your first service
                </button>
              </div>
            ) : (
              services.map((service) => (
                <div key={service.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{service.title}</h3>
                        {service.subtitle && (
                          <span className="text-sm text-gray-500">• {service.subtitle}</span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          service.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          service.styleType === 'fullscreen'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {service.styleType === 'fullscreen' ? 'Full Screen' : 'Card Style'}
                        </span>
                        <span className="text-xs text-gray-400">Order: {service.order}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        {service.backgroundImage && <span>Has Background</span>}
                        <span>Text: {service.textColor}</span>
                        {service.ctaText && <span>CTA: {service.ctaText}</span>}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleToggleActive(service.id, service.isActive)}
                        disabled={actionLoading === service.id}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title={service.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {service.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(service.id)}
                        disabled={actionLoading === service.id}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        {actionLoading === service.id ? (
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
                  {editingService ? 'Edit Service' : 'Add Service'}
                </h3>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Help Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Service Display Styles</h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• <strong>Full Screen:</strong> Large sections with background images and parallax scrolling</li>
                    <li>• <strong>Card Style:</strong> Compact cards displayed in a grid layout</li>
                    <li>• Mix both styles for visual variety and better user engagement</li>
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
                      placeholder="Service title"
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
                    placeholder="Brief service description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.detailedDescription}
                    onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d66] focus:border-transparent text-gray-900 placeholder-gray-600"
                    placeholder="Detailed service description (optional)"
                  />
                </div>

                {/* Background Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Image
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Upload image (JPG, PNG, GIF, WebP - Max 5MB)</label>
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
                    
                    <div className="text-center text-sm text-gray-500">or</div>
                    <div>
                      <input
                        type="text"
                        value={formData.backgroundImage}
                        onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d66] focus:border-transparent text-gray-900 placeholder-gray-600"
                        placeholder="Enter image URL"
                      />
                    </div>
                    
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
                      setEditingService(null);
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
                    {actionLoading === 'form' ? 'Saving...' : editingService ? 'Update' : 'Create'}
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