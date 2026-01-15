'use client';

import { useState, useEffect } from 'react';

interface ContactInfo {
  id: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string | null;
}

export default function AdminContactInfo() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    email: '',
    workingHours: '',
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/contact-info');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setContactInfo(data);
          setFormData({
            address: data.address || '',
            phone: data.phone || '',
            email: data.email || '',
            workingHours: data.workingHours || '',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = contactInfo ? 'PUT' : 'POST';
      const response = await fetch('/api/contact-info', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setContactInfo(updatedData);
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        successDiv.textContent = 'Contact information saved successfully!';
        document.body.appendChild(successDiv);
        setTimeout(() => {
          document.body.removeChild(successDiv);
        }, 3000);
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorDiv.textContent = 'Error saving contact information. Please try again.';
      document.body.appendChild(errorDiv);
      setTimeout(() => {
        document.body.removeChild(errorDiv);
      }, 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d66] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contact information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-serif text-[#004d66] uppercase tracking-widest">
              Contact Information Management
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your law firm's contact details that appear on the website
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Help Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for Contact Information</h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Address: Include full street address, city, state, and ZIP code</li>
                <li>• Phone: Use a format like (555) 123-4567 for consistency</li>
                <li>• Email: Use your professional business email address</li>
                <li>• Working Hours: Be specific about days and times for better client expectations</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Office Address *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d66] focus:border-transparent text-gray-900 placeholder-gray-600"
                  placeholder="Enter your complete office address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d66] focus:border-transparent text-gray-900 placeholder-gray-600"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d66] focus:border-transparent text-gray-900 placeholder-gray-600"
                  placeholder="contact@biolawsolutions.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Working Hours
                  <span className="text-xs text-gray-500 ml-2">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.workingHours}
                  onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d66] focus:border-transparent text-gray-900 placeholder-gray-600"
                  placeholder="Monday - Friday: 9:00 AM - 6:00 PM&#10;Saturday: 10:00 AM - 2:00 PM"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use line breaks to separate different days or time periods
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  if (contactInfo) {
                    setFormData({
                      address: contactInfo.address || '',
                      phone: contactInfo.phone || '',
                      email: contactInfo.email || '',
                      workingHours: contactInfo.workingHours || '',
                    });
                  }
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
                disabled={!contactInfo}
              >
                Reset to Current Values
              </button>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004d66]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-[#004d66] text-white text-sm font-medium rounded-md hover:bg-[#003d52] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004d66] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    contactInfo ? 'Update Contact Info' : 'Save Contact Info'
                  )}
                </button>
              </div>
            </div>
          </form>

          {(contactInfo || formData.address) && (
            <div className="px-6 pb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Info */}
                {contactInfo && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Current Contact Information:</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div><strong>Address:</strong> {contactInfo.address}</div>
                      <div><strong>Phone:</strong> {contactInfo.phone}</div>
                      <div><strong>Email:</strong> {contactInfo.email}</div>
                      {contactInfo.workingHours && (
                        <div><strong>Working Hours:</strong> {contactInfo.workingHours}</div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Live Preview */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="text-sm font-medium text-blue-900 mb-3">Live Preview (How it will appear on website):</h3>
                  <div className="space-y-3">
                    {formData.address && (
                      <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 mt-0.5 text-[#004d66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div className="text-sm text-gray-700">
                          {formData.address.split('\n').map((line, index) => (
                            <div key={index}>{line}</div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {formData.phone && (
                      <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 mt-0.5 text-[#004d66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <div className="text-sm">
                          <a href={`tel:${formData.phone}`} className="text-[#004d66] hover:underline">
                            {formData.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {formData.email && (
                      <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 mt-0.5 text-[#004d66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div className="text-sm">
                          <a href={`mailto:${formData.email}`} className="text-[#004d66] hover:underline">
                            {formData.email}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {formData.workingHours && (
                      <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 mt-0.5 text-[#004d66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-gray-700">
                          {formData.workingHours.split('\n').map((line, index) => (
                            <div key={index}>{line}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}