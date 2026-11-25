import { useState } from "react";
import api from "../api.js";
import { saveLogin } from "../auth.js";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        username: username,
        password: password,
      });
      saveLogin(res.data.token, res.data.user);
      onLogin(res.data.user);
    } catch (err) {
      let message = "Cannot reach the server. Please try again.";
      if (err.response) {
        if (err.response.data) {
          if (err.response.data.message) {
            message = err.response.data.message;
          }
        }
      }
      setError(message);
      setLoading(false);
    }
  }

  let errorBox = null;
  if (error !== "") {
    errorBox = (
      <p className="p-3 bg-red-50 text-red-700 text-sm rounded-md">{error}</p>
    );
  }

  let passwordType = "password";
  let toggleText = "Show";
  if (showPassword) {
    passwordType = "text";
    toggleText = "Hide";
  }

  let buttonText = "Sign in";
  if (loading) {
    buttonText = "Signing in...";
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 w-12 h-12 rounded-lg bg-gray-900 text-white flex items-center justify-center font-bold">
            LG
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            LogiGate Dispatch System
          </h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to continue</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-lg p-5 space-y-4"
        >
          <div>
            <label className="block text-sm text-gray-600 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <div className="relative">
              <input
                type={passwordType}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-16 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-800"
              >
                {toggleText}
              </button>
            </div>
          </div>

          {errorBox}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gray-900 text-white rounded-md font-medium active:scale-95 disabled:opacity-60"
          >
            {buttonText}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          Accounts are created by your manager. Need access? Contact them.
        </p>
      </div>
    </div>
  );
}
