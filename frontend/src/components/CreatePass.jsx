import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import api from "../api.js";

// Empty form values (keys match the backend field names)
const emptyForm = {
  truckNumber: "",
  driverName: "",
  driverPhone: "",
  transporter: "",
  invoiceNumber: "",
  destination: "",
  materialDescription: "",
  totalBoxes: "",
};

// Label shown next to each input
const fields = [
  ["truckNumber", "Truck Number"],
  ["driverName", "Driver Name"],
  ["driverPhone", "Driver Phone"],
  ["transporter", "Transporter"],
  ["invoiceNumber", "Invoice Number"],
  ["destination", "Destination"],
  ["materialDescription", "Material Name"],
  ["totalBoxes", "Total Boxes"],
];

export default function CreatePass() {
  // ---------- STATE ----------
  const [form, setForm] = useState(emptyForm);
  const [newPass, setNewPass] = useState(null); // the pass just created
  const [error, setError] = useState("");

  // ---------- Update one field as the user types ----------
  function handleChange(e) {
    const fieldName = e.target.name; // kaunsa input (jaise "truckNumber")
    const fieldValue = e.target.value; // usme kya likha hai

    // Purane form ki copy banao, phir sirf ek field badlo
    const newForm = Object.assign({}, form);
    newForm[fieldName] = fieldValue;

    setForm(newForm);
  }

  // ---------- Send the form to the backend ----------
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Form ki copy banao, aur totalBoxes ko number mein badlo
    const dataToSend = Object.assign({}, form);
    dataToSend.totalBoxes = Number(form.totalBoxes);

    try {
      const res = await api.post("/passes", dataToSend);
      setNewPass(res.data);
      setForm(emptyForm);
      alert("Gate-Pass is created");
    } catch (err) {
      // Backend ka message mile toh wahi dikhao, warna normal message
      let message = "Could not save the pass.";
      if (err.response) {
        if (err.response.data) {
          if (err.response.data.message) {
            message = err.response.data.message;
          }
        }
      }
      setError(message);
    }
  }

  // ---------- Input ka type: totalBoxes ke liye number, baaki text ----------
  function getInputType(name) {
    if (name === "totalBoxes") {
      return "number";
    }
    return "text";
  }

  // ---------- Error box: error ho tabhi dikhega ----------
  let errorBox = null;
  if (error !== "") {
    errorBox = <p className="text-sm text-red-600">{error}</p>;
  }

  // ---------- Right side: pass bana ho toh card, warna khali box ----------
  let rightSide = null;
  if (newPass === null) {
    rightSide = (
      <div className="bg-white border border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-500">
        Fill the form to generate a gate-pass with a QR code.
      </div>
    );
  } else {
    rightSide = (
      <div>
        <div className="print-area bg-white border border-gray-200 rounded-lg p-5 text-center">
          <h2 className="text-lg font-bold">Digital Gate-Pass</h2>
          <p className="text-2xl font-bold my-2">{newPass.passId}</p>
          <div className="flex justify-center my-3">
            <QRCodeSVG value={newPass.passId} size={180} />
          </div>
          <div className="text-sm text-left grid grid-cols-2 gap-y-1">
            <span className="text-gray-500">Truck</span>
            <span>{newPass.truckNumber}</span>
            <span className="text-gray-500">Driver</span>
            <span>
              {newPass.driverName} ({newPass.driverPhone})
            </span>
            <span className="text-gray-500">Transporter</span>
            <span>{newPass.transporter}</span>
            <span className="text-gray-500">Invoice</span>
            <span>{newPass.invoiceNumber}</span>
            <span className="text-gray-500">Destination</span>
            <span>{newPass.destination}</span>
            <span className="text-gray-500">Material</span>
            <span>{newPass.materialDescription}</span>
            <span className="text-gray-500">Total Boxes</span>
            <span>{newPass.totalBoxes}</span>
          </div>
        </div>
        <button
          onClick={() => window.print()}
          className="mt-3 w-full py-2 border border-gray-300 bg-white rounded-md"
        >
          Print Slip
        </button>
      </div>
    );
  }

  // ---------- SCREEN ----------
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Left: form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-lg p-5 space-y-3"
      >
        <h2 className="text-lg font-bold">New Gate-Pass</h2>

        {fields.map((f) => (
          <div key={f[0]}>
            <label className="block text-sm text-gray-600 mb-1">{f[1]}</label>
            <input
              name={f[0]}
              value={form[f[0]]}
              onChange={handleChange}
              type={getInputType(f[0])}
              min="1"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        ))}

        {errorBox}

        <button className="w-full py-2 active:scale-95 bg-gray-900 text-white rounded-md font-medium">
          Generate Gate-Pass
        </button>
      </form>

      {/* Right: digital pass card */}
      <div>{rightSide}</div>
    </div>
  );
}
