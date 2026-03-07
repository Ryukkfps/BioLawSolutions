import Link from "next/link";
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-serif text-[#004d66] uppercase tracking-widest">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                BioLaw Solutions Management Panel
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Content Management */}
            <Link href="/admin/content" className="block">
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <div className="w-8 h-8 bg-[#004d66] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">📄</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Content Sections
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          Homepage Content
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-[#004d66] hover:text-[#003d52]">
                      Manage Content →
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Services Management */}
            <Link href="/admin/services" className="block">
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <div className="w-8 h-8 bg-[#004d66] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">⚖️</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Legal Services
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          Service Portfolio
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-[#004d66] hover:text-[#003d52]">
                      Manage Services →
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Carousel Management */}
            <Link href="/admin/carousel" className="block">
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <div className="w-8 h-8 bg-[#004d66] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">🎠</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Carousel Slides
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          Manage Homepage
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-[#004d66] hover:text-[#003d52]">
                      View & Edit Slides →
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Enquiries Management */}
            <Link href="/admin/enquiries" className="block">
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <div className="w-8 h-8 bg-[#004d66] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">📧</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Enquiries
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          Client Messages
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-[#004d66] hover:text-[#003d52]">
                      View Messages →
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Appointments */}
            <Link href="/admin/appointments" className="block">
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <div className="w-8 h-8 bg-[#004d66] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">📅</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Appointments
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          Client Bookings
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-[#004d66] hover:text-[#003d52]">
                      View Appointments →
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Contact Info Management */}
            <Link href="/admin/contact-info" className="block">
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <div className="w-8 h-8 bg-[#004d66] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">📞</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Contact Info
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          Business Details
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-[#004d66] hover:text-[#003d52]">
                      Manage Contact Info →
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Reviews Management */}
            <Link href="/admin/reviews" className="block">
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <div className="w-8 h-8 bg-[#004d66] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">⭐</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Client Reviews
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          Testimonials
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-[#004d66] hover:text-[#003d52]">
                      Manage Reviews →
                    </span>
                  </div>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}