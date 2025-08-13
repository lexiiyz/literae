import { Link } from "react-router-dom";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FBF7F0] p-6 text-center">
      <ExclamationCircleIcon className="h-24 w-24 text-red-500 mb-6 animate-pulse" />
      <h1 className="text-4xl md:text-5xl font-bold text-[#2B2C2D] mb-4">404 - Halaman Tidak Ditemukan</h1>
      <p className="text-lg md:text-xl text-[#A9A9A9] mb-8 max-w-md">
        Maaf, halaman yang Anda cari tidak ada. Mungkin URL-nya salah atau halaman telah dipindahkan.
      </p>
      <Link 
        to="/"
        className="px-6 py-3 bg-[#B58B5C] text-white font-semibold rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
      >
        Kembali ke Halaman Utama
      </Link>
    </div>
  );
}
