import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { UserCircleIcon, IdentificationIcon, PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface Profile {
  fullName: string;
  address: string;
  phone: string;
  email: string;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // State untuk mengelola modal konfirmasi logout
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setLoading(true);
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/profile/${user.id}`)
      .then((res) => res.json())
      .then((data: Profile) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user, navigate]);

  // Fungsi untuk menampilkan modal konfirmasi
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };
  
  // Fungsi untuk mengkonfirmasi dan melakukan logout
  const handleConfirmLogout = () => {
    logout();
    toast.success("Berhasil keluar!", {
      duration: 3000,
      position: "bottom-center",
      style: {
        backgroundColor: '#B58B5C',
        color: 'white',
      },
    });
    navigate("/login");
    setShowLogoutModal(false); // Tutup modal setelah logout
  };
  
  // Fungsi untuk membatalkan logout
  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FBF7F0]">
        <p className="text-[#2B2C2D] text-xl font-semibold">Memuat profil...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FBF7F0]">
        <p className="text-[#A9A9A9] text-xl font-semibold">Profil tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FBF7F0] min-h-screen flex items-center justify-center p-6 mt-20">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl w-full max-w-2xl transform transition-transform duration-300 hover:scale-[1.01]">
        <div className="flex flex-col items-center text-center mb-8">
          <UserCircleIcon className="h-24 w-24 text-[#B58B5C] mb-4" />
          <h1 className="text-3xl font-bold text-[#2B2C2D]">Halo, {profile.fullName}!</h1>
          <p className="text-[#A9A9A9] text-lg mt-2">Selamat datang kembali di Literae.</p>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <IdentificationIcon className="h-6 w-6 text-[#00758F]" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[#A9A9A9]">Nama Lengkap</p>
              <p className="text-lg font-semibold text-[#2B2C2D]">{profile.fullName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <EnvelopeIcon className="h-6 w-6 text-[#00758F]" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[#A9A9A9]">Email</p>
              <p className="text-lg font-semibold text-[#2B2C2D]">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <PhoneIcon className="h-6 w-6 text-[#00758F]" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[#A9A9A9]">Nomor Telepon</p>
              <p className="text-lg font-semibold text-[#2B2C2D]">{profile.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <MapPinIcon className="h-6 w-6 text-[#00758F]" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[#A9A9A9]">Alamat</p>
              <p className="text-lg font-semibold text-[#2B2C2D]">{profile.address}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogoutClick}
          className="mt-10 w-full bg-red-500 text-white font-semibold py-3 rounded-full shadow-lg transition-transform hover:scale-105"
        >
          Keluar
        </button>
      </div>
      
      {/* Modal Konfirmasi Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full mx-auto text-center transform transition-all scale-100 duration-300">
            <h3 className="text-2xl font-bold text-[#2B2C2D] mb-4">Konfirmasi Keluar</h3>
            <p className="text-gray-700 mb-6">Apakah Anda yakin ingin keluar dari akun ini?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCancelLogout}
                className="px-6 py-2 rounded-lg font-semibold text-[#2B2C2D] border border-gray-300 transition-colors hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-6 py-2 rounded-lg font-semibold text-white bg-red-600 transition-colors hover:bg-red-700"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
