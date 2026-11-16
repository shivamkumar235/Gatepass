import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import api from "../api.js";

// Colour of the status badge
function badgeClass(status) {
  if (status === "Ready for Exit") return "bg-blue-100 text-blue-700";
  if (status === "Dispatched") return "bg-green-100 text-green-700";
  return "bg-red-100 text-red-700";
}

export default function Dashboard() {
  const [passes, setPasses] = useState([]);
  const [search, setSearch] = useState("");
  const [qrPass, setQrPass] = useState(null); // pass whose QR is open
  const [error, setError] = useState("");

  // Load all passes when the page opens
  useEffect(() => {
    api.get("/passes")
      .then((res) => setPasses(res.data))
      .catch(() => setError("Cannot reach the server. Is the backend running?"));
  }, []);

  // Count for the 4 summary boxes
  const count = (status) => passes.filter((p) => p.status === status).length;

  // Filter by truck number or pass ID
  const q = search.toLowerCase();
  const filtered = passes.filter(
    (p) => p.truckNumber.toLowerCase().includes(q) || p.passId.toLowerCase().includes(q)
  );

  // Make a CSV file from the visible rows and download it
  function downloadCSV() {
    const header = ["Pass ID", "Truck No", "Driver", "Destination", "Boxes", "Status", "Exit Time"];
    const rows = filtered.map((p) => [
      p.passId, p.truckNumber, p.driverName, p.destination, p.totalBoxes, p.status,
      p.exitTime ? new Date(p.exitTime).toLocaleString() : "",
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "gate-passes.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const boxes = [
    { label: "Total Trucks", value: passes.length, color: "text-gray-900" },
    { label: "Ready for Exit", value: count("Ready for Exit"), color: "text-blue-600" },
    { label: "Dispatched", value: count("Dispatched"), color: "text-green-600" },
    { label: "On Hold", value: count("On Hold"), color: "text-red-600" },
  ];

  return (
    <div>
      {error && <p className="mb-4 p-3 bg-red-50 text-red-700 rounded">{error}</p>}

      {/* Summary boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {boxes.map((b) => (
          <div key={b.label} className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500">{b.label}</p>
            <p className={"text-3xl font-bold " + b.color}>{b.value}</p>
          </div>
        ))}
      </div>

      {/* Search + CSV */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          className="flex-1 min-w-[200px] border border-gray-300 rounded-md px-3 py-2 bg-white"
          placeholder="Search by Truck Number or Pass ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={downloadCSV} className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm">
          Download CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {["Pass ID", "Truck No", "Driver", "Destination", "Boxes", "Status", "Exit Time", "QR"].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p._id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium">{p.passId}</td>
                <td className="px-4 py-3">{p.truckNumber}</td>
                <td className="px-4 py-3">{p.driverName}</td>
                <td className="px-4 py-3">{p.destination}</td>
                <td className="px-4 py-3">{p.totalBoxes}</td>
                <td className="px-4 py-3">
                  <span className={"px-2 py-1 rounded-full text-xs font-medium " + badgeClass(p.status)}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">{p.exitTime ? new Date(p.exitTime).toLocaleString() : "-"}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setQrPass(p)} className="text-blue-600 hover:underline">
                    View QR
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="8" className="px-4 py-6 text-center text-gray-500">No passes found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* QR popup */}
      {qrPass && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4" onClick={() => setQrPass(null)}>
          <div className="bg-white rounded-lg p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="font-bold text-lg mb-1">{qrPass.passId}</p>
            <p className="text-sm text-gray-500 mb-4">{qrPass.truckNumber}</p>
            <QRCodeSVG value={qrPass.passId} size={200} />
            <button onClick={() => setQrPass(null)} className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
