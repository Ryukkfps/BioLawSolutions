'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Sector {
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

export default function SectorsDisplay() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSectors();
  }, []);

  const fetchSectors = async () => {
    try {
      const response = await fetch('/api/sectors'); // Public endpoint - only active sectors
      if (response.ok) {
        const data = await response.json();
        setSectors(data);
      }
    } catch (error) {
      console.error('Error fetching sectors:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d66] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sectors...</p>
        </div>
      </div>
    );
  }

  if (sectors.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-[#004d66] mb-4">No Sectors Available</h2>
          <p className="text-gray-600">Please check back later.</p>
        </div>
      </div>
    );
  }

  // Separate sectors by style type
  const fullscreenSectors = sectors.filter(sector => sector.styleType === 'fullscreen');
  const cardSectors = sectors.filter(sector => sector.styleType === 'card');

  return (
    <div className="sectors-display">
      {/* Full-screen Sectors */}
      {fullscreenSectors.map((sector, index) => (
        <section
          key={sector.id}
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: sector.backgroundImage ? `url(${sector.backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            backgroundColor: sector.backgroundImage ? 'transparent' : '#f9fafb',
          }}
        >
          {/* Overlay */}
          {sector.backgroundImage && (
            <div 
              className="absolute inset-0 bg-black"
              style={{ opacity: sector.overlayOpacity }}
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
                    style={{ color: sector.textColor }}
                  >
                    {String(sector.order).padStart(2, '0')}
                  </span>
                </div>
                
                {sector.subtitle && (
                  <p 
                    className="text-lg md:text-xl mb-4 opacity-90 tracking-wider uppercase font-light"
                    style={{ color: sector.textColor }}
                  >
                    {sector.subtitle}
                  </p>
                )}
                
                <h2 
                  className="text-4xl md:text-5xl lg:text-6xl font-serif font-light mb-6 leading-tight tracking-widest uppercase"
                  style={{ color: sector.textColor }}
                >
                  {sector.title}
                </h2>
                
                <p 
                  className="text-lg md:text-xl mb-6 leading-relaxed opacity-90 whitespace-pre-wrap"
                  style={{ color: sector.textColor }}
                >
                  {sector.description}
                </p>

                {sector.detailedDescription && (
                  <div 
                    className="rich-text-content text-base mb-8 leading-relaxed opacity-80"
                    style={{ color: sector.textColor }}
                    dangerouslySetInnerHTML={{ __html: sector.detailedDescription }}
                  />
                )}
                
                {sector.ctaText && sector.ctaLink && (
                  <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                    <Link
                      href={sector.ctaLink}
                      className={`inline-flex items-center px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                        sector.textColor === 'white'
                          ? 'border-white text-white hover:bg-white hover:text-black'
                          : sector.textColor === 'black'
                          ? 'border-black text-black hover:bg-black hover:text-white'
                          : 'border-[#004d66] text-[#004d66] hover:bg-[#004d66] hover:text-white'
                      } border-2`}
                    >
                      {sector.ctaText}
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
                  {sector.backgroundImage ? (
                    <div className="aspect-square rounded-lg overflow-hidden shadow-2xl">
                      <img
                        src={sector.backgroundImage}
                        alt={sector.title}
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

      {/* Card-style Sectors */}
      {cardSectors.length > 0 && (
        <section className="py-20 px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif text-[#004d66] uppercase tracking-widest mb-4">
                Sectors We Serve
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cardSectors.map((sector, index) => (
                <div
                  key={sector.id}
                  className="group relative bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Background Image */}
                  {sector.backgroundImage && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={sector.backgroundImage}
                        alt={sector.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div 
                        className="absolute inset-0 bg-black"
                        style={{ opacity: sector.overlayOpacity }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="text-white text-sm font-bold tracking-widest uppercase bg-[#004d66] px-3 py-1 rounded">
                          {String(sector.order).padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-8">
                    {sector.subtitle && (
                      <p className="text-sm text-[#004d66] font-medium uppercase tracking-widest mb-2">
                        {sector.subtitle}
                      </p>
                    )}
                    
                    <h3 className="text-2xl font-serif text-gray-900 mb-4 group-hover:text-[#004d66] transition-colors">
                      {sector.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed whitespace-pre-wrap">
                      {sector.description}
                    </p>

                    {sector.detailedDescription && (
                      <div 
                        className="rich-text-content text-sm text-gray-500 mb-6 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: sector.detailedDescription }}
                      />
                    )}
                    
                    {sector.ctaText && sector.ctaLink && (
                      <Link
                        href={sector.ctaLink}
                        className="inline-flex items-center text-[#004d66] font-medium hover:text-[#003d52] transition-colors group"
                      >
                        {sector.ctaText}
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
