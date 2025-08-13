import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const userData = await res.json();
        login(userData);
        toast.success("Berhasil masuk!", {
          duration: 3000,
          position: "bottom-center",
          style: {
            backgroundColor: '#00758F',
            color: 'white',
          },
        });
        navigate("/");
      } else {
        const data = await res.json();
        setError(data.error || "Login gagal, coba lagi.");
        toast.error(data.error || "Login gagal, coba lagi.");
      }
    } catch (err) {
      setError("Gagal terhubung ke server. Periksa koneksi Anda.");
      toast.error("Gagal terhubung ke server.");
    }
  };

  return (
    <div className="bg-[#FBF7F0] min-h-screen flex items-center justify-center p-6 mt-20">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl w-full max-w-md transform transition-transform duration-300 hover:scale-[1.01]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#2B2C2D]">Masuk ke Akun Anda</h1>
          <p className="text-[#A9A9A9] text-md mt-2">Selamat datang kembali di Literae.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="pl-10 pr-3 py-3 w-full border border-gray-300 rounded-full focus:ring-2 focus:ring-[#B58B5C] focus:border-transparent transition-colors"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="pl-10 pr-3 py-3 w-full border border-gray-300 rounded-full focus:ring-2 focus:ring-[#B58B5C] focus:border-transparent transition-colors"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#00758F] text-white font-semibold py-3 rounded-full shadow-lg transition-transform hover:scale-105"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
