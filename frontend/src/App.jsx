import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import CreatePass from "./components/CreatePass.jsx";
import GuardScanner from "./components/GuardScanner.jsx";
import Login from "./components/Login.jsx";
import { getSavedUser, clearLogin, roleHome } from "./auth.js";

// Page sirf allowed roles ko dikhao, baaki ko unke home page par bhej do
function RoleRoute({ user, roles, children }) {
  if (roles.includes(user.role)) {
    return children;
  }
  return <Navigate to={roleHome[user.role]} replace />;
}

export default function App() {
  // Browser mein pehle se login hai toh wahi user, warna null
  const [user, setUser] = useState(getSavedUser());

  function handleLogout() {
    clearLogin();
    setUser(null);
  }

  // Login nahi hai toh sirf Login page
  if (user === null) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route
            path="/"
            element={
              <RoleRoute user={user} roles={["manager"]}>
                <Dashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/create"
            element={
              <RoleRoute user={user} roles={["manager", "dispatch"]}>
                <CreatePass />
              </RoleRoute>
            }
          />
          <Route
            path="/scanner"
            element={
              <RoleRoute user={user} roles={["manager", "guard"]}>
                <GuardScanner />
              </RoleRoute>
            }
          />

          {/* Galat URL ho toh apne home page par */}
          <Route
            path="*"
            element={<Navigate to={roleHome[user.role]} replace />}
          />
        </Routes>
      </main>
    </div>
  );
}
