'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function EnquiriesManagement() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await fetch('/api/enquiries');
      const data = await response.json();
      setEnquiries(data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await fetchEnquiries();
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry({ ...selectedEnquiry, status });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteEnquiry = async (id: string) => {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      try {
        const response = await fetch(`/api/enquiries/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          await fetchEnquiries();
          if (selectedEnquiry && selectedEnquiry.id === id) {
            setSelectedEnquiry(null);
          }
        }
      } catch (error) {
        console.error('Error deleting enquiry:', error);
      }
    }
  };

  const filteredEnquiries = enquiries.filter(enquiry => {
    if (filter === 'all') return true;
    return enquiry.status.toLowerCase() === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'read':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d66] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading enquiries...</p>
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
                Enquiries Management
              </h1>
            </div>
            <div className="flex space-x-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-[#004d66] focus:border-[#004d66] text-gray-900"
              >
                <option value="all">All Enquiries</option>
                <option value="pending">Pending</option>
                <option value="read">Read</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Enquiries List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Enquiries ({filteredEnquiries.length})
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Client messages and contact form submissions
                </p>
              </div>
              
              {filteredEnquiries.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No enquiries found.</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {filteredEnquiries.map((enquiry) => (
                    <li 
                      key={enquiry.id} 
                      className={`px-4 py-4 sm:px-6 cursor-pointer hover:bg-gray-50 ${
                        selectedEnquiry?.id === enquiry.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedEnquiry(enquiry)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {enquiry.subject}
                            </p>
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(enquiry.status)}`}>
                              {enquiry.status}
                            </span>
                          </div>
                          <div className="mt-1">
                            <p className="text-sm text-gray-600">
                              From: {enquiry.name} ({enquiry.email})
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(enquiry.createdAt).toLocaleDateString()} at {new Date(enquiry.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Enquiry Details */}
          <div className="lg:col-span-1">
            {selectedEnquiry ? (
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Enquiry Details
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {new Date(selectedEnquiry.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedEnquiry.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <a href={`mailto:${selectedEnquiry.email}`} className="text-[#004d66] hover:underline">
                          {selectedEnquiry.email}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Subject</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedEnquiry.subject}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Message</dt>
                      <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                        {selectedEnquiry.message}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1">
                        <select
                          value={selectedEnquiry.status}
                          onChange={(e) => updateStatus(selectedEnquiry.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-[#004d66] focus:border-[#004d66] text-gray-900"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="READ">Read</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>
                      </dd>
                    </div>
                  </dl>
                  
                  <div className="mt-6 flex space-x-3">
                    <a
                      href={`mailto:${selectedEnquiry.email}?subject=Re: ${selectedEnquiry.subject}`}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#004d66] hover:bg-[#003d52] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004d66]"
                    >
                      Reply via Email
                    </a>
                    <button
                      onClick={() => deleteEnquiry(selectedEnquiry.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 text-center">
                  <p className="text-gray-500">Select an enquiry to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}