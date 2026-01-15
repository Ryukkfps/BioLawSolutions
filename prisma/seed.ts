import "dotenv/config";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ["error"],
});

async function main() {
  // Create sample carousel slides
  await prisma.carouselSlide.createMany({
    data: [
      {
        title: "Expert Legal Counsel",
        subtitle: "Bio Law Solutions",
        description: "Navigate the complex intersection of biology, technology, and law with our specialized expertise.",
        image: "/hero-1.jpg",
        ctaText: "Learn More",
        order: 1,
        isActive: true,
      },
      {
        title: "Innovative Legal Solutions",
        subtitle: "For Modern Challenges",
        description: "Protecting your interests in biotechnology, pharmaceuticals, and emerging life sciences.",
        image: "/hero-2.jpg", 
        ctaText: "Get Started",
        order: 2,
        isActive: true,
      },
      {
        title: "Trusted Partnership",
        subtitle: "Proven Results",
        description: "Years of experience helping clients succeed in the rapidly evolving biotech landscape.",
        image: "/hero-3.jpg",
        ctaText: "Contact Us",
        order: 3,
        isActive: true,
      },
    ],
  });

  // Create sample services
  await prisma.service.createMany({
    data: [
      {
        title: "Biotechnology Law",
        description: "Comprehensive legal services for biotech companies, from startup to IPO.",
        icon: "biotech",
        order: 1,
        isActive: true,
      },
      {
        title: "Pharmaceutical Compliance",
        description: "Navigate FDA regulations and ensure compliance across all pharmaceutical operations.",
        icon: "pharma",
        order: 2,
        isActive: true,
      },
      {
        title: "Intellectual Property",
        description: "Protect your innovations with strategic IP planning and patent prosecution.",
        icon: "ip",
        order: 3,
        isActive: true,
      },
    ],
  });

  // Create sample contact information
  await prisma.contactInfo.create({
    data: {
      address: "123 Legal Plaza, Suite 456\nBiotech District\nSan Francisco, CA 94105",
      phone: "(555) 123-4567",
      email: "info@biolawsolutions.com",
      workingHours: "Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 2:00 PM",
    },
  });

  // Create sample reviews
  await prisma.review.createMany({
    data: [
      {
        author: "Dr. Sarah Johnson",
        content: "Bio Law Solutions provided exceptional guidance for our biotech startup's IP strategy. Their expertise in both science and law made all the difference in securing our patents.",
        rating: 5,
        isApproved: true,
      },
      {
        author: "Michael Chen",
        content: "Outstanding legal support for our pharmaceutical compliance needs. The team's deep understanding of FDA regulations saved us months of delays.",
        rating: 5,
        isApproved: true,
      },
      {
        author: "Dr. Emily Rodriguez",
        content: "Professional, knowledgeable, and responsive. They helped us navigate complex regulatory requirements with ease. Highly recommend their services.",
        rating: 5,
        isApproved: true,
      },
      {
        author: "James Wilson",
        content: "Excellent legal counsel for our medical device company. Their attention to detail and proactive approach exceeded our expectations.",
        rating: 4,
        isApproved: true,
      },
      {
        author: "Lisa Thompson",
        content: "Great experience working with Bio Law Solutions. They made complex legal matters understandable and provided clear, actionable advice.",
        rating: 5,
        isApproved: false, // This one is pending approval
      },
    ],
  });

  // Create sample about sections
  await prisma.aboutSection.createMany({
    data: [
      {
        title: "Claire Sanders",
        subtitle: "MEET OUR FOUNDER",
        content: '"Having worked in fast growth and highly innovative environments, I understand the pressures and competing priorities experienced by start-up and scale-up businesses."\n\nClaire qualified as a corporate lawyer in 2007, working initially in private practice before moving in-house to build and lead the legal functions of some of the most iconic consumer brands.\n\nClaire now specialises in delivering practical legal solutions to high growth companies and has extensive experience working collaboratively across business functions.',
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000",
        layout: "NORMAL",
        order: 1,
        isActive: true,
      },
      {
        title: "Our Mission",
        subtitle: "WHAT DRIVES US",
        content: "At Bio Law Solutions, we are dedicated to providing expert legal guidance at the intersection of life sciences and technology. Our mission is to empower innovators by navigating complex legal landscapes with precision and foresight.\n\nWe believe in a collaborative approach, working closely with our clients to understand their unique challenges and goals. Our team combines deep legal expertise with a passion for scientific progress.",
        image: "https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?q=80&w=1000",
        layout: "MIRRORED",
        order: 2,
        isActive: true,
      }
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });