import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Layout from "./components/Layout/Layout";
import DashboardLayout from "./layouts/DashboardLayout";
import Overview from "./pages/Overview";
import Projects from "./pages/Projects";
import Settings from "./pages/Settings";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/u/:userId" element={<PublicProfile />} />

      {/* Dashboard with nested routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="projects" element={<Projects />} />
        <Route path="community" element={<Community />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/:userId" element={<Profile />} />
      </Route>

      {/* Editor Route */}
      <Route
        path="/editor/:id?"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

