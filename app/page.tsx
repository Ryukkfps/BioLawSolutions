import HeroCarousel from "@/components/HeroCarousel";
import Link from "next/link";
import AppointmentForm from "@/components/public/AppointmentForm";
import pool from "@/lib/db";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Type definition for carousel slide
interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default async function Home() {
  let slides: CarouselSlide[] = [];

  try {
    const [rows] = await pool.query(
      'SELECT * FROM CarouselSlide WHERE isActive = true ORDER BY `order` ASC'
    );
    slides = rows as CarouselSlide[];
  } catch (error) {
    console.error('Database error:', error);
    // Fallback to empty array if database fails
    slides = [];
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="grow">
        <HeroCarousel initialSlides={slides} />
        
        {/* Additional sections can be added here */}
        <section className="py-20 px-8 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-serif text-[#004d66] mb-6">Welcome to Bio Law Solutions</h2>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We are a premier law firm dedicated to providing exceptional legal counsel in the intersection of biology, 
              technology, and law. Our expertise helps innovative companies and individuals navigate 
              the complexities of modern legal landscapes.
            </p>
          </div>
        </section>

        {/* Appointment Section */}
        <section className="py-20 px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-sm tracking-[0.4em] text-gray-400 font-medium uppercase mb-4">Book a Consultation</h2>
              <h3 className="text-4xl font-serif text-[#004d66] uppercase tracking-widest">Schedule an Appointment</h3>
            </div>
            <AppointmentForm />
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-50 py-12 px-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-[#004d66] font-serif text-xl mb-4 uppercase tracking-widest">Bio Law Solutions</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Providing expert legal guidance for the biological age.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-widest text-xs">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-[#004d66] transition-colors">Home</Link></li>
              <li><Link href="/service" className="hover:text-[#004d66] transition-colors">Services</Link></li>
              <li><Link href="/about" className="hover:text-[#004d66] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#004d66] transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-widest text-xs">Contact Us</h4>
            <p className="text-sm text-gray-600 mb-2">123 Legal Plaza, Suite 456</p>
            <p className="text-sm text-gray-600 mb-2">City, State 12345</p>
            <p className="text-sm text-gray-600">info@biolawsolutions.com</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Bio Law Solutions. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}