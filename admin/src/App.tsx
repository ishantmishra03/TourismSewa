import { Route, Routes } from "react-router-dom";
import PublicRoute from "./components/security/PublicRoute";
import ProtectedRoute from "./components/security/ProtectedRoute";
import BusinessNavbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ApproveReviews from "./pages/ApproveReviews";

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
          <Route path="/approve-reviews" element={<ApproveReviews />} />
        </Route>
      </Routes>
    </>
  );
}
