'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AboutSection {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  image: string;
  layout: 'NORMAL' | 'MIRRORED';
  order: number;
}

function ScrollReveal({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => {
      if (domRef.current) {
        observer.unobserve(domRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`reveal ${isVisible ? 'active' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export default function AboutPage() {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSections() {
      try {
        const response = await fetch('/api/about');
        const data = await response.json();
        setSections(data.filter((s: any) => s.isActive !== false));
      } catch (error) {
        console.error('Error fetching about sections:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSections();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d66]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20 animate-fadeInUp">
      {/* Hero Section */}
      <div className="bg-[#004d66] text-white py-24 px-8 mb-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-light tracking-[0.2em] uppercase mb-4">About Our Firm</h1>
          <div className="w-24 h-1 bg-[#d4af37] mx-auto"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 space-y-32">
        {sections.map((section, index) => (
          <ScrollReveal key={section.id} className="w-full">
            <div className={`flex flex-col ${section.layout === 'MIRRORED' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-20`}>
              {/* Image Side */}
              <div className="w-full md:w-1/2">
                <div className="relative aspect-[4/5] w-full max-w-md mx-auto overflow-hidden shadow-2xl">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Text Side */}
              <div className="w-full md:w-1/2 space-y-8">
                <div>
                  {section.subtitle && (
                    <p className="text-[#d4af37] text-sm font-bold tracking-[0.2em] uppercase mb-4">
                      {section.subtitle}
                    </p>
                  )}
                  <h2 className="text-4xl md:text-5xl font-serif text-[#004d66] mb-8 leading-tight">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                  {section.content.split('\n').map((para, i) => (
                    para.trim() && <p key={i}>{para}</p>
                  ))}
                </div>

                <div className="pt-8">
                  <Link
                    href="/contact"
                    className="inline-block bg-[#004d66] text-white px-10 py-4 text-sm font-bold tracking-[0.2em] hover:bg-[#003d52] transition-all transform hover:-translate-y-1 shadow-lg"
                  >
                    GET IN TOUCH
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}

        {sections.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 italic">Content is being updated. Please check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
