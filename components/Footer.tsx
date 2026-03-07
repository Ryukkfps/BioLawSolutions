'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LegalPage {
  id: string;
  title: string;
  slug: string;
}

export default function Footer() {
  const [legalPages, setLegalPages] = useState<LegalPage[]>([]);

  useEffect(() => {
    async function fetchLegalPages() {
      try {
        const response = await fetch('/api/legal-pages');
        if (response.ok) {
          const data = await response.json();
          setLegalPages(data);
        }
      } catch (error) {
        console.error('Error fetching legal pages:', error);
      }
    }
    fetchLegalPages();
  }, []);

  return (
    <footer className="bg-gray-50 py-12 px-8 border-t border-gray-100">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left">
        <div>
          <h3 className="text-[#004d66] font-serif text-xl mb-4 uppercase tracking-widest">BioLaw Solutions</h3>
          <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto md:mx-0">
            Strategic Legal Counsel for Life Sciences
          </p>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-widest text-xs">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-[#004d66] transition-colors">Home</Link></li>
            <li><Link href="/services" className="hover:text-[#004d66] transition-colors">Services</Link></li>
            <li><Link href="/sectors" className="hover:text-[#004d66] transition-colors">Sectors</Link></li>
            <li><Link href="/about" className="hover:text-[#004d66] transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-[#004d66] transition-colors">Contact</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-col items-center gap-4">
          <p className="text-xs text-gray-400 uppercase tracking-[0.2em] text-center">
            © {new Date().getFullYear()} BioLaw Solutions. All Rights Reserved.
          </p>
          
          {/* Dynamic Legal Pages - Side by Side */}
          {legalPages.length > 0 && (
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              {legalPages.map((page) => (
                <Link 
                  key={page.id} 
                  href={`/${page.slug}`} 
                  className="text-[10px] text-gray-400 uppercase tracking-widest hover:text-[#004d66] transition-colors"
                >
                  {page.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
