import HeroCarousel from "@/components/HeroCarousel";
import ContentSections from "@/components/ContentSections";
import Link from "next/link";
import AppointmentForm from "@/components/public/AppointmentForm";
import ContactInfo from "@/components/ContactInfo";
import ReviewsDisplay from "@/components/ReviewsDisplay";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  let slides: any[] = [];

  try {
    slides = await prisma.carouselSlide.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
  } catch (error) {
    console.error('Database error:', error);
    slides = [];
  }

  return (
    <div className="flex flex-col min-h-lvh">
      {/* Hero Carousel - First Component */}
      <HeroCarousel initialSlides={slides} />
      
      {/* Dynamic Content Sections - After Carousel */}
      <ContentSections />
      
      <main className="grow">
        {/* Additional sections can be added here */}
        {/* <section className="py-20 px-8 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-serif text-[#004d66] mb-6">Welcome to BioLaw Solutions</h2>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We are a premier law firm dedicated to providing exceptional legal counsel in the intersection of biology, 
              technology, and law. Our expertise helps innovative companies and individuals navigate 
              the complexities of modern legal landscapes.
            </p>
          </div>
        </section> */}

        {/* Reviews Section */}
        {/* <section className="py-16 px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <ReviewsDisplay variant="carousel" limit={5} />
            <div className="text-center mt-8">
              <Link 
                href="/reviews" 
                className="inline-flex items-center px-6 py-3 border border-[#004d66] text-[#004d66] text-sm font-bold tracking-widest uppercase hover:bg-[#004d66] hover:text-white transition-colors"
              >
                View All Reviews
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section> */}

        {/* Appointment Section */}
        {/* <section className="py-20 px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-sm tracking-[0.4em] text-gray-400 font-medium uppercase mb-4">Book a Consultation</h2>
              <h3 className="text-4xl font-serif text-[#004d66] uppercase tracking-widest">Schedule an Appointment</h3>
            </div>
            <AppointmentForm />
          </div>
        </section> */}
      </main>
    </div>
  );
}