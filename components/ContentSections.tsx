'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ContentSection {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  backgroundImage: string;
  ctaText: string | null;
  ctaLink: string | null;
  textColor: string;
  overlayOpacity: number;
  order: number;
  isActive: boolean;
}

export default function ContentSections() {
  const [content, setContent] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content'); // Public endpoint - only active content
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d66] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  if (content.length === 0) {
    return null; // Don't render anything if no content
  }

  return (
    <div className="content-sections">
      {content.map((section, index) => (
        <section
          key={section.id}
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: `url(${section.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black"
            style={{ opacity: section.overlayOpacity }}
          />
          
          {/* Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              {section.subtitle && (
                <p 
                  className="text-lg md:text-xl mb-4 opacity-90 tracking-wider uppercase font-light"
                  style={{ color: section.textColor }}
                >
                  {section.subtitle}
                </p>
              )}
              
              <h1 
                className="text-4xl md:text-6xl lg:text-7xl font-serif font-light mb-8 leading-tight tracking-widest uppercase"
                style={{ color: section.textColor }}
              >
                {section.title}
              </h1>
              
              <p 
                className="text-lg md:text-xl mb-12 max-w-4xl mx-auto leading-relaxed opacity-90"
                style={{ color: section.textColor }}
              >
                {section.description}
              </p>
              
              {section.ctaText && section.ctaLink && (
                <div className="animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                  {section.ctaLink.startsWith('http') ? (
                    <a
                      href={section.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                        section.textColor === 'white'
                          ? 'border-white text-white hover:bg-white hover:text-black'
                          : section.textColor === 'black'
                          ? 'border-black text-black hover:bg-black hover:text-white'
                          : 'border-[#004d66] text-[#004d66] hover:bg-[#004d66] hover:text-white'
                      } border-2`}
                    >
                      {section.ctaText}
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  ) : (
                    <Link
                      href={section.ctaLink}
                      className={`inline-flex items-center px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                        section.textColor === 'white'
                          ? 'border-white text-white hover:bg-white hover:text-black'
                          : section.textColor === 'black'
                          ? 'border-black text-black hover:bg-black hover:text-white'
                          : 'border-[#004d66] text-[#004d66] hover:bg-[#004d66] hover:text-white'
                      } border-2`}
                    >
                      {section.ctaText}
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Scroll indicator for first content section */}
          {index === 0 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div 
                className="w-6 h-10 border-2 rounded-full flex justify-center"
                style={{ borderColor: section.textColor }}
              >
                <div 
                  className="w-1 h-3 rounded-full mt-2 animate-pulse"
                  style={{ backgroundColor: section.textColor }}
                />
              </div>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}