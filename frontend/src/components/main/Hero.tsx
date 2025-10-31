import { ArrowRight, Sparkles, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const scrollToExperiences = () => {
    document
      .getElementById("experiences")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          "url(https://images.pexels.com/photos/1647563/pexels-photo-1647563.jpeg?auto=compress&cs=tinysrgb&w=1920)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Layered Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-teal-900/30 via-transparent to-blue-900/30"></div>

      {/* Animated Particles Effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-teal-400 rounded-full animate-ping"></div>
        <div
          className="absolute top-3/4 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-2/3 w-2 h-2 bg-teal-300 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-8 sm:space-y-10">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500/20 to-blue-500/20 backdrop-blur-md border border-teal-400/30 rounded-full shadow-lg">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300 animate-pulse" />
            <span className="text-teal-200 font-medium uppercase tracking-wider text-xs sm:text-sm">
              Your Adventure Begins Here
            </span>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300 animate-pulse" />
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
              Discover the{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-300 text-transparent bg-clip-text animate-pulse">
                  Soul of Nepal
                </span>
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full transform scale-x-0 animate-[scaleIn_1s_ease-out_0.5s_forwards]"></span>
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-light px-4">
              Embark on extraordinary journeys through majestic Himalayas,
              ancient temples, and vibrant cultures. Experience Nepal the way
              locals know it.
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="w-full max-w-2xl mx-auto px-4">
            <div
              className={`flex items-center bg-white/10 backdrop-blur-xl rounded-full border-2 transition-all duration-300 shadow-2xl ${
                isFocused
                  ? "border-teal-400 shadow-teal-500/50 scale-105"
                  : "border-white/20 hover:border-white/40"
              }`}
            >
              <div className="pl-6 pr-3">
                <Search
                  className={`w-5 h-5 transition-colors duration-300 ${
                    isFocused ? "text-teal-300" : "text-gray-300"
                  }`}
                />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search experiences, destinations, activities..."
                className="flex-1 px-2 py-4 bg-transparent text-white placeholder-gray-300 focus:outline-none text-sm sm:text-base"
              />
              <button
                onClick={handleSearch}
                className="m-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-6 sm:px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-teal-500/50 whitespace-nowrap text-sm sm:text-base"
              >
                Search
              </button>
            </div>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            <button
              onClick={scrollToExperiences}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-8 sm:px-10 py-4 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-teal-500/50"
            >
              Explore Experiences
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </button>

            <button
              onClick={() => navigate("/auth")}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white border-2 border-white/40 hover:border-white/60 px-8 sm:px-10 py-4 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Book Now
              <div className="w-2 h-2 bg-teal-400 rounded-full group-hover:animate-ping"></div>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 pt-8 text-gray-300 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
              <span>Verified Guides</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <span>Safe & Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <span>Best Price Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none"></div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes scaleIn {
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
}
