import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#004d66] text-white py-20">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Ready to discuss your legal needs? Get in touch with our expert team today.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-serif text-[#004d66] mb-8 uppercase tracking-widest">
                Get In Touch
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Office Address</h3>
                  <p className="text-gray-600">
                    123 Legal Plaza, Suite 456<br />
                    City, State 12345<br />
                    United States
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h3>
                  <p className="text-gray-600">
                    <strong>Phone:</strong> +1 (555) 123-4567<br />
                    <strong>Email:</strong> info@biolawsolutions.com<br />
                    <strong>Fax:</strong> +1 (555) 123-4568
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Office Hours</h3>
                  <p className="text-gray-600">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 2:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Contact</h3>
                  <p className="text-gray-600">
                    For urgent legal matters outside office hours:<br />
                    <strong>Emergency Line:</strong> +1 (555) 999-0000
                  </p>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Choose Bio Law Solutions?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Specialized expertise in biotechnology law</li>
                  <li>• Experienced team with proven track record</li>
                  <li>• Personalized attention to each client</li>
                  <li>• Comprehensive legal solutions</li>
                  <li>• Competitive and transparent pricing</li>
                </ul>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-serif text-[#004d66] mb-8 uppercase tracking-widest">
                Send Us A Message
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}