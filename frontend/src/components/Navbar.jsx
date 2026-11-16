// Top bar with the 3 role-switch buttons
export default function Navbar({ view, setView }) {
  const tabs = [
    { id: "dashboard", label: "Manager Dashboard" },
    { id: "create", label: "Create Gate-Pass (Dispatch)" },
    { id: "scanner", label: "Gate Scanner (Security Guard)" },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-gray-900">LogiGate Dispatch System</h1>
        <nav className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              className={
                "px-3 py-2 rounded-md text-sm font-medium border " +
                (view === t.id
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100")
              }
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
