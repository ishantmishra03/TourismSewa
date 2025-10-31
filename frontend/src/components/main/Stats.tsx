import { Users, Mountain, Star, Globe } from "lucide-react";

export default function Stats() {
  const stats = [
    { icon: Users, value: "10K+", label: "Happy Travelers" },
    { icon: Mountain, value: "500+", label: "Adventures" },
    { icon: Star, value: "4.9", label: "Average Rating" },
    { icon: Globe, value: "50+", label: "Destinations" },
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-center border border-gray-100 dark:border-gray-700"
            >
              <Icon className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
