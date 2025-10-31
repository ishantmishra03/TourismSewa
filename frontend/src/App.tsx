import React from "react";
import { Routes, Route } from "react-router-dom";

import { HomePage } from "./pages/Home";
import { Navbar } from "./components/layout/Navbar";
import PublicRoute from "./components/security/PublicRoute";
import { Auth } from "./pages/auth/Auth";
import ProtectedRoute from "./components/security/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import NotFound from "./components/extra/NotFound";

import Experiences from "./pages/experience/Experiences";
import { ExperienceDetailPage } from "./pages/experience/ExperienceDetails";
import SearchExperience from "./pages/experience/SearchExperience";
import DigitalMap from "./pages/DigitalMap";

import { BusinessesPage } from "./pages/business/BusinessesPage";
import BusinessDetail from "./pages/business/BusinessDetailsPage";
import BookingForm from "./pages/booking/BookingForm";
import Bookings from "./pages/booking/Bookings";
import { BookingConfirmationPage } from "./pages/booking/BookingConfirmationPage";

const App: React.FC = () => {
  return (
    <div>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* // Experiences */}
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/experience/:id" element={<ExperienceDetailPage />} />
            <Route path="/search" element={<SearchExperience />} />

            {/* // Businesses  */}
            <Route path="/businesses" element={<BusinessesPage />} />
            <Route path="/business/:id" element={<BusinessDetail />} />

            {/* Allow only when logged out  */}
            <Route element={<PublicRoute />}>
              <Route path="/auth" element={<Auth />} />
            </Route>

            {/* Allow only when logged in  */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/map" element={<DigitalMap />} />

              {/* Bookings  */}
              <Route path="/book-now" element={<BookingForm />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route
                path="/booking-confirmation"
                element={<BookingConfirmationPage />}
              />
            </Route>

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
