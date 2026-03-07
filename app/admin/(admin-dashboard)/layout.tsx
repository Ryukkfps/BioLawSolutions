import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import SignOutButton from '@/components/admin/SignOutButton';
import HeaderSignOutButton from '@/components/admin/HeaderSignOutButton';
import AdminSessionProvider from '@/components/admin/AdminSessionProvider';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Briefcase, 
  Mail, 
  Star, 
  Calendar, 
  Phone,
  FileText,
  Info
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Content', icon: FileText, href: '/admin/content' },
    { name: 'Carousel', icon: ImageIcon, href: '/admin/carousel' },
    { name: 'Services', icon: Briefcase, href: '/admin/services' },
    { name: 'Sectors', icon: Briefcase, href: '/admin/sectors' },
    { name: 'Contact Info', icon: Phone, href: '/admin/contact-info' },
    { name: 'Enquiries', icon: Mail, href: '/admin/enquiries' },
    { name: 'Reviews', icon: Star, href: '/admin/reviews' },
    { name: 'About Us', icon: Info, href: '/admin/about' },
    { name: 'Legal Pages', icon: FileText, href: '/admin/legal-pages' },
    { name: 'Appointments', icon: Calendar, href: '/admin/appointments' },
  ];

  return (
    <AdminSessionProvider>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-[#004d66] text-white hidden md:flex flex-col">
          <div className="p-6 border-b border-white/10">
            <h1 className="text-xl font-serif tracking-widest uppercase">Admin Panel</h1>
            <p className="text-[10px] text-white/50 tracking-widest uppercase mt-1">BioLaw Solutions</p>
          </div>
          <nav className="flex-grow p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-white/10 rounded-lg transition-colors"
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-white/10">
            <SignOutButton />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow flex flex-col">
          <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-800 uppercase tracking-wider">Admin Panel</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {session.user?.name || 'Admin'}</span>
              <HeaderSignOutButton />
            </div>
          </header>
          <div className="flex-grow">
            {children}
          </div>
        </main>
      </div>
    </AdminSessionProvider>
  );
}