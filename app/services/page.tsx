import ServicesDisplay from "@/components/ServicesDisplay";

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#004d66] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-light uppercase tracking-widest mb-4">
              Modular Legal Support for Regulated Healthcare and Life Sciences
              Businesses
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our services are structured to support companies at different
              stages of growth - from early-stage scale-ups to established
              global operators. We offer flexible engagement models including
              retained, fractional, interim and project-based mandates.
            </p>
          </div>
        </div>
      </div>

      {/* Services Display */}
      <ServicesDisplay />

      {/* Call to Action Section */}
      <section className="py-20 px-8 bg-[#004d66] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-light uppercase tracking-widest mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Contact our experienced legal team to discuss your specific needs
            and learn how we can help your business navigate the complex world
            of biotechnology law.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-[#004d66] text-sm font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors"
            >
              Schedule Consultation
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </a>
            <a
              href="tel:+1-555-123-4567"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white text-sm font-bold tracking-widest uppercase hover:bg-white hover:text-[#004d66] transition-colors"
            >
              Call Now
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
