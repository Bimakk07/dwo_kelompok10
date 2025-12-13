"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(false);

    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(true);
        setMessage(data.message || "Terjadi kesalahan");
        return;
      }

      setMessage(data.message);

      if (isLogin) {
        localStorage.setItem("isLoggedIn", "true");
        router.push("/"); // langsung redirect tanpa loading
      } else {
        setIsLogin(true);
        setUsername("");
        setPassword("");
      }
    } catch (err) {
      setError(true);
      setMessage("Terjadi kesalahan server");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        {/* Judul */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          {isLogin ? "Welcome Back 👋" : "Create Account ✨"}
        </h2>
        <p className="text-center text-gray-500 mb-6">
          {isLogin
            ? "Silakan login untuk masuk dashboard"
            : "Daftar akun baru untuk melanjutkan"}
        </p>

        {/* Message */}
        {message && (
          <div
            className={`text-sm text-center mb-4 p-2 rounded ${
              error ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Username</label>
            <input
              type="text"
              placeholder="Masukkan username"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* Switch Login/Register */}
        <p className="text-center text-sm text-gray-600 mt-6">
          {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
          <span
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
              setError(false);
            }}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
