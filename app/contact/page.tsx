import ContactForm from '@/components/ContactForm';
import ContactInfo from '@/components/ContactInfo';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#004d66] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-light uppercase tracking-widest mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get in touch with our experienced legal team for expert guidance on biotech law, 
              intellectual property, and regulatory compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-serif text-[#004d66] uppercase tracking-widest mb-6">
                Send us a Message
              </h2>
              <ContactForm />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <ContactInfo variant="card" showTitle={true} />
            
            {/* Additional Information */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-serif text-[#004d66] mb-4 uppercase tracking-widest">
                Why Choose Bio Law Solutions?
              </h3>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#004d66] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">
                    <strong>Specialized Expertise:</strong> Deep knowledge in biotechnology, 
                    pharmaceutical, and life sciences law.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#004d66] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">
                    <strong>Regulatory Compliance:</strong> Navigate complex FDA, EPA, 
                    and international regulatory frameworks.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#004d66] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">
                    <strong>IP Protection:</strong> Comprehensive intellectual property 
                    strategies for innovative technologies.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#004d66] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">
                    <strong>Client-Focused:</strong> Personalized legal solutions 
                    tailored to your business needs.
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Emergency Legal Assistance
              </h3>
              <p className="text-sm text-red-700 mb-3">
                For urgent legal matters requiring immediate attention, 
                please call our emergency hotline.
              </p>
              <a 
                href="tel:+1-555-EMERGENCY" 
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Emergency Hotline
              </a>
            </div>
          </div>
        </div>

        {/* Map Section (Placeholder) */}
        <div className="mt-16">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-serif text-[#004d66] uppercase tracking-widest">
                Our Location
              </h3>
            </div>
            <div className="h-64 bg-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm">Interactive map will be displayed here</p>
                <p className="text-xs text-gray-400 mt-1">
                  Integration with Google Maps or similar service
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}