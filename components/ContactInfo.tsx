'use client';

import { useState, useEffect } from 'react';

interface ContactInfoData {
  id: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string | null;
}

interface ContactInfoProps {
  variant?: 'default' | 'footer' | 'sidebar' | 'card';
  showTitle?: boolean;
  className?: string;
}

export default function ContactInfo({ 
  variant = 'default', 
  showTitle = true, 
  className = '' 
}: ContactInfoProps) {
  const [contactInfo, setContactInfo] = useState<ContactInfoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/contact-info');
      if (response.ok) {
        const data = await response.json();
        setContactInfo(data);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (!contactInfo) {
    return null;
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'footer':
        return {
          container: 'text-white',
          title: 'text-lg font-semibold mb-4 text-white',
          item: 'flex items-start space-x-3 mb-3',
          icon: 'w-5 h-5 mt-0.5 text-gray-300',
          text: 'text-gray-300 text-sm',
          link: 'text-gray-300 hover:text-white transition-colors'
        };
      case 'sidebar':
        return {
          container: 'bg-gray-50 p-6 rounded-lg',
          title: 'text-lg font-semibold mb-4 text-gray-900',
          item: 'flex items-start space-x-3 mb-4',
          icon: 'w-5 h-5 mt-0.5 text-[#004d66]',
          text: 'text-gray-700 text-sm',
          link: 'text-[#004d66] hover:underline'
        };
      case 'card':
        return {
          container: 'bg-white p-6 rounded-xl shadow-lg border border-gray-100',
          title: 'text-xl font-serif text-[#004d66] mb-6 uppercase tracking-widest',
          item: 'flex items-start space-x-4 mb-4',
          icon: 'w-6 h-6 mt-0.5 text-[#004d66]',
          text: 'text-gray-700',
          link: 'text-[#004d66] hover:underline font-medium'
        };
      default:
        return {
          container: '',
          title: 'text-lg font-semibold mb-4 text-gray-900',
          item: 'flex items-start space-x-3 mb-3',
          icon: 'w-5 h-5 mt-0.5 text-[#004d66]',
          text: 'text-gray-700 text-sm',
          link: 'text-[#004d66] hover:underline'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`${styles.container} ${className}`}>
      {showTitle && (
        <h3 className={styles.title}>
          Contact Information
        </h3>
      )}
      
      <div className="space-y-1">
        {/* Address */}
        <div className={styles.item}>
          <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div>
            <div className={styles.text}>
              {contactInfo.address.split('\n').map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className={styles.item}>
          <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <div>
            <a href={`tel:${contactInfo.phone}`} className={styles.link}>
              {contactInfo.phone}
            </a>
          </div>
        </div>

        {/* Email */}
        <div className={styles.item}>
          <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <div>
            <a href={`mailto:${contactInfo.email}`} className={styles.link}>
              {contactInfo.email}
            </a>
          </div>
        </div>

        {/* Working Hours */}
        {contactInfo.workingHours && (
          <div className={styles.item}>
            <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className={styles.text}>
                {contactInfo.workingHours}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}