'use client';

import { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, Eye, EyeOff } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  content: string;
  rating: number;
  isApproved: boolean;
  createdAt: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews?admin=true');
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalToggle = async (reviewId: string, currentStatus: boolean) => {
    setActionLoading(reviewId);
    
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isApproved: !currentStatus }),
      });
      
      if (response.ok) {
        const updatedReview = await response.json();
        setReviews(reviews.map(review => 
          review.id === reviewId ? updatedReview : review
        ));
        if (selectedReview?.id === reviewId) {
          setSelectedReview(updatedReview);
        }
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert(`Error updating review status: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Error updating review status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    setActionLoading(reviewId);
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setReviews(reviews.filter(review => review.id !== reviewId));
        if (selectedReview?.id === reviewId) {
          setSelectedReview(null);
        }
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Error deleting review');
    } finally {
      setActionLoading(null);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'approved') return review.isApproved;
    if (filter === 'pending') return !review.isApproved;
    return true;
  });

  const stats = {
    total: reviews.length,
    approved: reviews.filter(r => r.isApproved).length,
    pending: reviews.filter(r => !r.isApproved).length,
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d66] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-serif text-[#004d66] uppercase tracking-widest mb-2">
            Reviews Management
          </h1>
          <p className="text-gray-600">
            Manage client reviews and testimonials for your website
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">All Reviews</h2>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004d66] focus:border-transparent text-gray-900"
                  >
                    <option value="all">All Reviews</option>
                    <option value="approved">Approved Only</option>
                    <option value="pending">Pending Only</option>
                  </select>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredReviews.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No reviews found</p>
                  </div>
                ) : (
                  filteredReviews.map((review) => (
                    <div
                      key={review.id}
                      className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedReview?.id === review.id ? 'bg-blue-50 border-l-4 border-l-[#004d66]' : ''
                      }`}
                      onClick={() => setSelectedReview(review)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-gray-900">{review.author}</h3>
                            <div className="flex space-x-1">
                              {renderStars(review.rating)}
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              review.isApproved 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {review.isApproved ? 'Approved' : 'Pending'}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {review.content}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Review Details */}
          <div className="lg:col-span-1">
            {selectedReview ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Review Details</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Author</label>
                      <p className="text-gray-900">{selectedReview.author}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Rating</label>
                      <div className="flex space-x-1 mt-1">
                        {renderStars(selectedReview.rating)}
                        <span className="ml-2 text-sm text-gray-600">
                          ({selectedReview.rating}/5)
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Review Content</label>
                      <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                        {selectedReview.content}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <p className={`mt-1 ${
                        selectedReview.isApproved ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {selectedReview.isApproved ? 'Approved' : 'Pending Approval'}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Submitted</label>
                      <p className="text-gray-900 mt-1">
                        {new Date(selectedReview.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={() => handleApprovalToggle(selectedReview.id, selectedReview.isApproved)}
                      disabled={actionLoading === selectedReview.id}
                      className={`w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        selectedReview.isApproved
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      } disabled:opacity-50`}
                    >
                      {actionLoading === selectedReview.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          {selectedReview.isApproved ? (
                            <EyeOff className="w-4 h-4 mr-2" />
                          ) : (
                            <Check className="w-4 h-4 mr-2" />
                          )}
                          {selectedReview.isApproved ? 'Unapprove' : 'Approve'}
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(selectedReview.id)}
                      disabled={actionLoading === selectedReview.id}
                      className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      {actionLoading === selectedReview.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Review
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Select a review to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}