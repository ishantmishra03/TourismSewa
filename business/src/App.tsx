import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import PublicRoute from "./components/security/PublicRoute";
import ProtectedRoute from "./components/security/ProtectedRoute";
import BusinessNavbar from "./components/layout/Navbar";
import AddExperience from "./pages/AddExperience";
import Experiences from "./pages/Experiences";
import Bookings from "./pages/Bookings";

export default function App() {
  return (
    <>
      <BusinessNavbar />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/add-experience" element={<AddExperience />} />
          <Route path="/bookings" element={<Bookings />} />
        </Route>
      </Routes>
    </>
  );
}
