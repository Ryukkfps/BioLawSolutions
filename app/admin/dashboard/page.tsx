import { prisma } from '@/lib/prisma';
import { 
  Mail, 
  Calendar, 
  Star, 
  ArrowUpRight 
} from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const [enquiriesCount, appointmentsCount, reviewsCount] = await Promise.all([
    prisma.enquiry.count({ where: { status: 'PENDING' } }),
    prisma.appointment.count({ where: { status: 'PENDING' } }),
    prisma.review.count({ where: { isApproved: false } }),
  ]);

  const stats = [
    { name: 'Pending Enquiries', value: enquiriesCount, icon: Mail, color: 'text-blue-600', bg: 'bg-blue-50', href: '/admin/enquiries' },
    { name: 'New Appointments', value: appointmentsCount, icon: Calendar, color: 'text-green-600', bg: 'bg-green-50', href: '/admin/appointments' },
    { name: 'Reviews to Moderate', value: reviewsCount, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50', href: '/admin/reviews' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`${stat.bg} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <Link href={stat.href} className="text-gray-400 hover:text-[#004d66] transition-colors">
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#004d66] uppercase tracking-wider">System Overview</h3>
        </div>
        <div className="p-8">
          <p className="text-gray-600 leading-relaxed">
            Welcome to the Bio Law Solutions administration panel. From here, you can manage all aspects of your website, 
            including content updates, client enquiries, and appointment scheduling. Use the sidebar to navigate 
            through different management modules.
          </p>
        </div>
      </div>
    </div>
  );
}
