import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Briefcase, 
  Mail, 
  Star, 
  Calendar, 
  LogOut,
  Phone
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
    { name: 'Carousel', icon: ImageIcon, href: '/admin/carousel' },
    { name: 'Services', icon: Briefcase, href: '/admin/services' },
    { name: 'Contact Info', icon: Phone, href: '/admin/contact' },
    { name: 'Enquiries', icon: Mail, href: '/admin/enquiries' },
    { name: 'Reviews', icon: Star, href: '/admin/reviews' },
    { name: 'Appointments', icon: Calendar, href: '/admin/appointments' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#004d66] text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-serif tracking-widest uppercase">Admin Panel</h1>
          <p className="text-[10px] text-white/50 tracking-widest uppercase mt-1">Bio Law Solutions</p>
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
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800 uppercase tracking-wider">Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {session.user?.name || 'Admin'}</span>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
