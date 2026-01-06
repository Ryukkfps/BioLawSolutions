import ReviewsDisplay from '@/components/ReviewsDisplay';
import ReviewForm from '@/components/ReviewForm';

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#004d66] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-light uppercase tracking-widest mb-4">
              Client Reviews
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Read what our clients say about our legal services and share your own experience 
              with Bio Law Solutions.
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Display Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ReviewsDisplay variant="grid" />
      </div>

      {/* Submit Review Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-[#004d66] uppercase tracking-widest mb-4">
              Share Your Experience
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We value your feedback. Please take a moment to share your experience 
              with our legal services to help other clients make informed decisions.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-8">
            <ReviewForm />
          </div>
        </div>
      </div>

      {/* Why Reviews Matter Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-serif text-[#004d66] uppercase tracking-widest mb-4">
              Why Your Review Matters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#004d66] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Help Others</h3>
              <p className="text-gray-600 text-sm">
                Your honest feedback helps potential clients understand the quality 
                of our legal services and make informed decisions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#004d66] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Improve Services</h3>
              <p className="text-gray-600 text-sm">
                Your feedback helps us continuously improve our legal services 
                and better serve our clients' needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#004d66] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Build Trust</h3>
              <p className="text-gray-600 text-sm">
                Authentic reviews from real clients help build trust and credibility 
                in our legal practice and expertise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}