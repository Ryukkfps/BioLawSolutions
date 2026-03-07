import SectorsDisplay from '@/components/SectorsDisplay';

export default function SectorsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#004d66] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-light uppercase tracking-widest mb-4">
              Our Sectors
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Specialized legal expertise across key industries in biotechnology, life sciences, and technology.
            </p>
          </div>
        </div>
      </div>

      {/* Sectors Display */}
      <SectorsDisplay />

      {/* Call to Action Section */}
      <section className="py-20 px-8 bg-[#004d66] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-light uppercase tracking-widest mb-6">
            Explore Your Industry
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Contact our experienced legal team to discuss how we can support your business in your specific sector.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-[#004d66] text-sm font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors"
            >
              Schedule Consultation
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
