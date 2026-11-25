import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import api from "../api.js";

// Status ke hisaab se badge ka colour batata hai
function badgeClass(status) {
  if (status === "Ready for Exit") {
    return "bg-blue-100 text-blue-700";
  }
  if (status === "Dispatched") {
    return "bg-green-100 text-green-700";
  }
  return "bg-red-100 text-red-700";
}

export default function Dashboard() {
  // ---------- STATE (component ki yaaddasht) ----------
  const [passes, setPasses] = useState([]); // backend se aaye saare passes
  const [search, setSearch] = useState(""); // search box ka text
  const [qrPass, setQrPass] = useState(null); // jis pass ka QR popup khula hai
  const [error, setError] = useState(""); // error message

  // ---------- DATA LOAD: page khulte hi ek baar chalega ----------
  useEffect(() => {
    async function loadPasses() {
      try {
        const res = await api.get("/passes");
        setPasses(res.data);
      } catch (err) {
        setError("Cannot reach the server. Is the backend running?");
      }
    }
    loadPasses();
  }, []);

  // ---------- COUNT: kisi status ke kitne passes hain ----------
  function count(status) {
    let total = 0;
    for (let i = 0; i < passes.length; i++) {
      if (passes[i].status === status) {
        total = total + 1;
      }
    }
    return total;
  }

  // ---------- SEARCH: truck number ya pass ID se filter ----------
  const searchText = search.toLowerCase();
  const filtered = [];
  for (let i = 0; i < passes.length; i++) {
    const p = passes[i];
    const truckMatch = p.truckNumber.toLowerCase().includes(searchText);
    const idMatch = p.passId.toLowerCase().includes(searchText);
    if (truckMatch || idMatch) {
      filtered.push(p);
    }
  }

  // ---------- CSV DOWNLOAD ----------
  function downloadCSV() {
    // Column ke naam
    const header = [
      "Pass ID",
      "Truck No",
      "Driver",
      "Destination",
      "Boxes",
      "Status",
      "Exit Time",
    ];

    // Har pass ke liye ek row (array)
    const rows = filtered.map((p) => {
      let exitText = "";
      if (p.exitTime) {
        exitText = new Date(p.exitTime).toLocaleString();
      }
      return [
        p.passId,
        p.truckNumber,
        p.driverName,
        p.destination,
        p.totalBoxes,
        p.status,
        exitText,
      ];
    });

    // Har row ke items ko "," se jodo, aur rows ko new line se jodo
    const allRows = [header, ...rows];
    const lines = allRows.map((row) => {
      const quoted = row.map((item) => '"' + item + '"');
      return quoted.join(",");
    });
    const csv = lines.join("\n");

    // Text ko file banake download karwana
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "gate-passes.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  // ---------- UPAR KE 4 SUMMARY BOXES ----------
  const boxes = [
    { label: "Total Trucks", value: passes.length, color: "text-gray-900" },
    {
      label: "Ready for Exit",
      value: count("Ready for Exit"),
      color: "text-blue-600",
    },
    {
      label: "Dispatched",
      value: count("Dispatched"),
      color: "text-green-600",
    },
    { label: "On Hold", value: count("On Hold"), color: "text-red-600" },
  ];

  // ---------- TABLE KE HEADING ----------
  const headings = [
    "Pass ID",
    "Truck No",
    "Driver",
    "Destination",
    "Boxes",
    "Status",
    "Exit Time",
    "QR",
  ];

  // ---------- ERROR BOX: error ho tabhi dikhega ----------
  let errorBox = null;
  if (error !== "") {
    errorBox = (
      <p className="mb-4 p-3 bg-red-50 text-red-700 rounded">{error}</p>
    );
  }

  // ---------- "NO PASSES FOUND" ROW: list khali ho tabhi ----------
  let emptyRow = null;
  if (filtered.length === 0) {
    emptyRow = (
      <tr>
        <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
          No passes found.
        </td>
      </tr>
    );
  }

  // ---------- QR POPUP: qrPass ho tabhi dikhega ----------
  let qrPopup = null;
  if (qrPass !== null) {
    qrPopup = (
      <div
        className="fixed inset-0 bg-black/40 flex items-center justify-center p-4"
        onClick={() => setQrPass(null)}
      >
        <div
          className="bg-white rounded-lg p-6 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="font-bold text-lg mb-1">{qrPass.passId}</p>
          <p className="text-sm text-gray-500 mb-4">{qrPass.truckNumber}</p>
          <QRCodeSVG value={qrPass.passId} size={200} />
          <button
            onClick={() => setQrPass(null)}
            className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // ---------- SCREEN ----------
  return (
    <div>
      {errorBox}

      {/* Summary boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {boxes.map((b) => (
          <div
            key={b.label}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
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
        <button
          onClick={downloadCSV}
          className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm"
        >
          Download CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {headings.map((h) => (
                <th key={h} className="px-4 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              // Exit time: hai toh date dikhao, nahi toh "-"
              let exitTimeText = "-";
              if (p.exitTime) {
                exitTimeText = new Date(p.exitTime).toLocaleString();
              }

              return (
                <tr key={p._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium">{p.passId}</td>
                  <td className="px-4 py-3">{p.truckNumber}</td>
                  <td className="px-4 py-3">{p.driverName}</td>
                  <td className="px-4 py-3">{p.destination}</td>
                  <td className="px-4 py-3">{p.totalBoxes}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "px-2 py-1 rounded-full text-xs font-medium " +
                        badgeClass(p.status)
                      }
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{exitTimeText}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setQrPass(p)}
                      className="text-blue-600 hover:underline"
                    >
                      View QR
                    </button>
                  </td>
                </tr>
              );
            })}
            {emptyRow}
          </tbody>
        </table>
      </div>

      {qrPopup}
    </div>
  );
}
