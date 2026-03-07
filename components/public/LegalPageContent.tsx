'use client';

import { useState, useEffect } from 'react';

interface LegalPage {
  title: string;
  content: string;
  updatedAt: string;
}

export default function LegalPageContent({ slug }: { slug: string }) {
  const [page, setPage] = useState<LegalPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPage();
  }, [slug]);

  const fetchPage = async () => {
    try {
      const response = await fetch(`/api/legal-pages?slug=${slug}`);
      if (response.ok) {
        const data = await response.json();
        setPage(data);
      }
    } catch (error) {
      console.error('Error fetching legal page:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d66]"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-[#004d66] mb-4">Page Not Found</h1>
          <p className="text-gray-600">The requested legal page does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light uppercase tracking-widest mb-4 text-[#004d66] border-b pb-8">
          {page.title}
        </h1>
        <p className="text-sm text-gray-400 mb-12">
          Last Updated: {new Date(page.updatedAt).toLocaleDateString()}
        </p>
        <div 
          className="rich-text-content"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
}
