import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        <Image 
          src="/img/biolawsolutionslogo.png" 
          alt="Bio Law Solutions Logo" 
          width={150} 
          height={150} 
          className="h-20 w-auto"
        />
        <div className="flex flex-col items-start ml-2">
          <span className="text-xl tracking-[0.2em] text-[#004d66] font-serif font-light leading-none uppercase">Bio Law Solutions</span>
        </div>
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        <Link href="/" className="text-sm font-medium tracking-widest text-gray-600 hover:text-[#004d66] transition-colors uppercase">
          Home
        </Link>
        <Link href="/services" className="text-sm font-medium tracking-widest text-gray-600 hover:text-[#004d66] transition-colors uppercase">
          Services
        </Link>
        <Link href="/about" className="text-sm font-medium tracking-widest text-gray-600 hover:text-[#004d66] transition-colors uppercase">
          About
        </Link>
        <Link href="/contact" className="text-sm font-medium tracking-widest text-gray-600 hover:text-[#004d66] transition-colors uppercase">
          Contact
        </Link>
      </nav>

      <Link 
        href="/contact" 
        className="bg-[#004d66] text-white px-6 py-2.5 text-xs font-bold tracking-widest hover:bg-[#003d52] transition-colors uppercase"
      >
        Get in Touch
      </Link>
    </header>
  );
}
