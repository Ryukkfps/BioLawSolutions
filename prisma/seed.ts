import "dotenv/config";
import { prisma } from '../lib/prisma';

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