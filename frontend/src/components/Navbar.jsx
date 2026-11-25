import { NavLink } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  // Har tab ke saath likha hai ki kaun dekh sakta hai
  const allTabs = [
    { path: "/", label: "Manager Dashboard", roles: ["manager"] },
    { path: "/create", label: "Create Gate-Pass (Dispatch)", roles: ["manager", "dispatch"] },
    { path: "/scanner", label: "Gate Scanner (Security Guard)", roles: ["manager", "guard"] },
  ];

  // Sirf wahi tabs rakho jo is user ke role ko allowed hain
  const tabs = [];
  for (let i = 0; i < allTabs.length; i++) {
    if (allTabs[i].roles.includes(user.role)) {
      tabs.push(allTabs[i]);
    }
  }

  function getButtonClass(isActive) {
    const common = "px-3 py-2 rounded-md text-sm font-medium border ";
    if (isActive) {
      return common + "bg-gray-900 text-white border-gray-900";
    }
    return common + "bg-white text-gray-700 border-gray-300 hover:bg-gray-100";
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-gray-900">LogiGate Dispatch System</h1>

        <div className="flex flex-wrap items-center gap-3">
          <nav className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <NavLink
                key={t.path}
                to={t.path}
                end
                className={({ isActive }) => getButtonClass(isActive)}
              >
                {t.label}
              </NavLink>
            ))}
          </nav>

          {/* User ka naam aur Logout */}
          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <div className="text-right leading-tight">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            <button
              onClick={onLogout}
              className="px-3 py-2 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}