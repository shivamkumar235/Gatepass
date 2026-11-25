import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import api from "../api.js";

export default function GuardScanner() {
  const [passId, setPassId] = useState("");
  const [allPasses, setAllPasses] = useState([]); // for the dropdown (easy testing)
  const [pass, setPass] = useState(null); // the pass that was found
  const [message, setMessage] = useState("");
  const [cameraOn, setCameraOn] = useState(false);

  // Load Pass IDs for the dropdown
  useEffect(() => {
    api
      .get("/passes")
      .then((res) => setAllPasses(res.data))
      .catch(() => {});
  }, []);

  // Look up a pass in the backend
  async function findPass(id) {
    setMessage("");
    setPass(null);
    try {
      const res = await api.get("/passes/" + id.trim());
      setPass(res.data);
    } catch {
      setMessage("Pass not found: " + id);
    }
  }

  // Start / stop the camera scanner
  useEffect(() => {
    if (!cameraOn) return;
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 220 },
      false,
    );
    scanner.render(
      (text) => {
        // QR read successfully
        setPassId(text);
        findPass(text);
        setCameraOn(false);
      },
      () => {}, // ignore scan errors while searching
    );
    return () => {
      scanner.clear().catch(() => {});
    };
  }, [cameraOn]);

  // Change status to Dispatched or On Hold
  async function updateStatus(status) {
    try {
      const res = await api.put("/passes/" + pass.passId, { status });
      setPass(res.data);
    } catch {
      setMessage("Could not update the pass.");
    }
  }

  const approved = pass && pass.status === "Ready for Exit";

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Search card */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
        <h2 className="text-lg font-bold">Scan Gate-Pass</h2>

        <button
          onClick={() => setCameraOn(!cameraOn)}
          className="w-full py-2 bg-gray-900 text-white rounded-md"
        >
          {cameraOn ? "Stop Camera" : "Scan QR with Camera"}
        </button>
        {cameraOn && <div id="reader" />}

        <p className="text-sm text-gray-500 text-center">
          or choose / type a Pass ID
        </p>
        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
          value=""
          onChange={(e) => {
            setPassId(e.target.value);
            findPass(e.target.value);
          }}
        >
          <option value="">Select a Pass ID</option>
          {allPasses.map((p) => (
            <option key={p._id} value={p.passId}>
              {p.passId} - {p.truckNumber}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            className="flex-1 border border-gray-300 rounded-md px-3 py-2"
            placeholder="e.g. GP-1001"
            value={passId}
            onChange={(e) => setPassId(e.target.value)}
          />
          <button
            onClick={() => findPass(passId)}
            className="px-4 border border-gray-300 rounded-md"
          >
            Find
          </button>
        </div>
        {message && <p className="text-sm text-red-600">{message}</p>}
      </div>

      {/* Verification card */}
      {pass && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div
            className={
              "p-4 text-center text-white text-xl font-bold " +
              (approved ? "bg-green-600" : "bg-red-600")
            }
          >
            {approved ? "APPROVED FOR EXIT" : "ALREADY DISPATCHED / ON HOLD"}
          </div>
          <div className="p-5 text-sm grid grid-cols-2 gap-y-2">
            <span className="text-gray-500">Pass ID</span>
            <span className="font-medium">{pass.passId}</span>
            <span className="text-gray-500">Truck Number</span>
            <span className="font-medium">{pass.truckNumber}</span>
            <span className="text-gray-500">Driver Name</span>
            <span>{pass.driverName}</span>
            <span className="text-gray-500">Transporter</span>
            <span>{pass.transporter}</span>
            <span className="text-gray-500">Destination</span>
            <span>{pass.destination}</span>
            <span className="text-gray-500">Total Boxes</span>
            <span>{pass.totalBoxes}</span>
            <span className="text-gray-500">Status</span>
            <span>{pass.status}</span>
            {pass.exitTime && (
              <>
                <span className="text-gray-500">Exit Time</span>
                <span>{new Date(pass.exitTime).toLocaleString()}</span>
              </>
            )}
          </div>
          <div className="p-5 pt-0 grid grid-cols-2 gap-3">
            <button
              onClick={() => updateStatus("Dispatched")}
              disabled={!approved}
              className="py-3 bg-green-600 text-white rounded-md font-medium disabled:opacity-40"
            >
              Confirm Exit &amp; Out
            </button>
            <button
              onClick={() => updateStatus("On Hold")}
              disabled={pass.status === "On Hold"}
              className="py-3 bg-red-600 text-white rounded-md font-medium disabled:opacity-40"
            >
              Put on Hold
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
