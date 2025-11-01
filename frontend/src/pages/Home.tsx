import Stats from "../components/main/Stats";
import Hero from "../components/main/Hero";
import Categories from "../components/main/Categories";
import WhyChoose from "../components/main/WhyChoose";
import FeaturedExperiences from "../components/main/FeaturedExperiences";
import CTA from "../components/main/CTA";

import TBot from "../components/TBot";

export function HomePage() {
  return (
    <div className="relative min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <Stats />

      {/* Categories */}
      <Categories />

      {/* Why Choose Us */}
      <WhyChoose />

      {/* Featured Experiences */}
      <FeaturedExperiences />

      {/* Call To Action */}
      <CTA />

      <TBot />
    </div>
  );
}
