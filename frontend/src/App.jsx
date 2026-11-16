import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import CreatePass from "./components/CreatePass.jsx";
import GuardScanner from "./components/GuardScanner.jsx";

export default function App() {
  // Which screen is showing: "dashboard", "create" or "scanner"
  const [view, setView] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar view={view} setView={setView} />
      <main className="max-w-6xl mx-auto p-4">
        {view === "dashboard" && <Dashboard />}
        {view === "create" && <CreatePass />}
        {view === "scanner" && <GuardScanner />}
      </main>
    </div>
  );
}
