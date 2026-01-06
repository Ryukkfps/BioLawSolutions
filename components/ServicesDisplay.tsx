'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
  styleType: string; // 'fullscreen' or 'card'
  order: number;
  icon: string | null;
  isActive: boolean;
}

export default function ServicesDisplay() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services'); // Public endpoint - only active services
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d66] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-[#004d66] mb-4">No Services Available</h2>
          <p className="text-gray-600">Please check back later for our legal services.</p>
        </div>
      </div>
    );
  }

  // Separate services by style type
  const fullscreenServices = services.filter(service => service.styleType === 'fullscreen');
  const cardServices = services.filter(service => service.styleType === 'card');

  return (
    <div className="services-display">
      {/* Full-screen Services */}
      {fullscreenServices.map((service, index) => (
        <section
          key={service.id}
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: service.backgroundImage ? `url(${service.backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            backgroundColor: service.backgroundImage ? 'transparent' : '#f9fafb',
          }}
        >
          {/* Overlay */}
          {service.backgroundImage && (
            <div 
              className="absolute inset-0 bg-black"
              style={{ opacity: service.overlayOpacity }}
            />
          )}
          
          {/* Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className={`${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'} animate-fadeInUp`}>
                <div className="mb-4">
                  <span 
                    className="text-sm font-bold tracking-widest uppercase opacity-80"
                    style={{ color: service.textColor }}
                  >
                    {String(service.order).padStart(2, '0')}
                  </span>
                </div>
                
                {service.subtitle && (
                  <p 
                    className="text-lg md:text-xl mb-4 opacity-90 tracking-wider uppercase font-light"
                    style={{ color: service.textColor }}
                  >
                    {service.subtitle}
                  </p>
                )}
                
                <h2 
                  className="text-4xl md:text-5xl lg:text-6xl font-serif font-light mb-6 leading-tight tracking-widest uppercase"
                  style={{ color: service.textColor }}
                >
                  {service.title}
                </h2>
                
                <p 
                  className="text-lg md:text-xl mb-6 leading-relaxed opacity-90"
                  style={{ color: service.textColor }}
                >
                  {service.description}
                </p>

                {service.detailedDescription && (
                  <p 
                    className="text-base mb-8 leading-relaxed opacity-80"
                    style={{ color: service.textColor }}
                  >
                    {service.detailedDescription}
                  </p>
                )}
                
                {service.ctaText && service.ctaLink && (
                  <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                    <Link
                      href={service.ctaLink}
                      className={`inline-flex items-center px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                        service.textColor === 'white'
                          ? 'border-white text-white hover:bg-white hover:text-black'
                          : service.textColor === 'black'
                          ? 'border-black text-black hover:bg-black hover:text-white'
                          : 'border-[#004d66] text-[#004d66] hover:bg-[#004d66] hover:text-white'
                      } border-2`}
                    >
                      {service.ctaText}
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>

              {/* Visual Element */}
              <div className={`${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'} animate-fadeInUp`} style={{ animationDelay: '0.2s' }}>
                <div className="relative">
                  {service.backgroundImage ? (
                    <div className="aspect-square rounded-lg overflow-hidden shadow-2xl">
                      <img
                        src={service.backgroundImage}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-[#004d66] rounded-lg flex items-center justify-center shadow-2xl">
                      <div className="text-6xl text-white opacity-50">⚖️</div>
                    </div>
                  )}
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#004d66] opacity-20 rounded-full"></div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#004d66] opacity-30 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Card-style Services */}
      {cardServices.length > 0 && (
        <section className="py-20 px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif text-[#004d66] uppercase tracking-widest mb-4">
                Additional Services
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Comprehensive legal solutions tailored to your specific needs in the biotechnology and life sciences industry.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cardServices.map((service, index) => (
                <div
                  key={service.id}
                  className="group relative bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Background Image */}
                  {service.backgroundImage && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={service.backgroundImage}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div 
                        className="absolute inset-0 bg-black"
                        style={{ opacity: service.overlayOpacity }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="text-white text-sm font-bold tracking-widest uppercase bg-[#004d66] px-3 py-1 rounded">
                          {String(service.order).padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-8">
                    {service.subtitle && (
                      <p className="text-sm text-[#004d66] font-medium uppercase tracking-widest mb-2">
                        {service.subtitle}
                      </p>
                    )}
                    
                    <h3 className="text-2xl font-serif text-gray-900 mb-4 group-hover:text-[#004d66] transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {service.description}
                    </p>

                    {service.detailedDescription && (
                      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                        {service.detailedDescription}
                      </p>
                    )}
                    
                    {service.ctaText && service.ctaLink && (
                      <Link
                        href={service.ctaLink}
                        className="inline-flex items-center text-[#004d66] font-medium hover:text-[#003d52] transition-colors group"
                      >
                        {service.ctaText}
                        <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}