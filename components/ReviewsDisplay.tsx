'use client';

import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  content: string;
  rating: number;
  isApproved: boolean;
  createdAt: string;
}

interface ReviewsDisplayProps {
  variant?: 'grid' | 'carousel' | 'list';
  limit?: number;
  showTitle?: boolean;
  className?: string;
}

export default function ReviewsDisplay({ 
  variant = 'grid', 
  limit,
  showTitle = true,
  className = '' 
}: ReviewsDisplayProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews'); // Public endpoint - only approved reviews
      if (response.ok) {
        const data = await response.json();
        setReviews(limit ? data.slice(0, limit) : data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
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

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500">No reviews available yet.</p>
      </div>
    );
  }

  const ReviewCard = ({ review }: { review: Review }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-full">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <Quote className="w-8 h-8 text-[#004d66] opacity-50" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex space-x-1">
              {renderStars(review.rating)}
            </div>
            <span className="text-sm text-gray-600">({review.rating}/5)</span>
          </div>
          
          <blockquote className="text-gray-700 mb-4 leading-relaxed">
            "{review.content}"
          </blockquote>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{review.author}</p>
              <p className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (variant === 'carousel') {
    return (
      <div className={className}>
        {showTitle && (
          <h2 className="text-2xl font-serif text-[#004d66] uppercase tracking-widest text-center mb-8">
            Client Testimonials
          </h2>
        )}
        
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {reviews.map((review) => (
                <div key={review.id} className="w-full flex-shrink-0 px-4">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>
          
          {reviews.length > 1 && (
            <>
              <button
                onClick={prevReview}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextReview}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <div className="flex justify-center mt-6 space-x-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-[#004d66]' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={className}>
        {showTitle && (
          <h2 className="text-2xl font-serif text-[#004d66] uppercase tracking-widest mb-8">
            Client Reviews
          </h2>
        )}
        
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    );
  }

  // Default grid variant
  return (
    <div className={className}>
      {showTitle && (
        <h2 className="text-2xl font-serif text-[#004d66] uppercase tracking-widest text-center mb-8">
          What Our Clients Say
        </h2>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}