import { Shield, Users, TrendingUp } from "lucide-react";

export default function WhyChoose() {
  const features = [
    {
      icon: Shield,
      title: "Safe & Secure",
      description:
        "All experiences vetted by local experts with comprehensive safety measures",
    },
    {
      icon: Users,
      title: "Local Guides",
      description:
        "Authentic experiences led by knowledgeable local guides who know Nepal best",
    },
    {
      icon: TrendingUp,
      title: "Best Prices",
      description:
        "Direct booking with local operators means better prices for you",
    },
  ];
  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 py-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose TourismSewa?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We make exploring Nepal simple, safe, and unforgettable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center border border-gray-200 dark:border-gray-700"
              >
                <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
