import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import toast from 'react-hot-toast';

interface Bookmark {
  id: string;
  title: string;
  authors?: string[];
  thumbnail?: string;
  price?: number;
}

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);

export default function BookmarkPage() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk mengelola modal konfirmasi
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [bookIdToDelete, setBookIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`http://localhost:5000/bookmarks/${user.id}`)
      .then((res) => res.json())
      .then((data: Bookmark[]) => {
        setBookmarks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);
  
  // Fungsi untuk menampilkan modal konfirmasi
  const handleDeleteClick = (bookId: string) => {
    setBookIdToDelete(bookId);
    setShowConfirmationModal(true);
  };
  
  // Fungsi untuk menghapus item setelah dikonfirmasi
  const handleConfirmDelete = async () => {
    if (!user || !bookIdToDelete) return;

    try {
      await fetch(`http://localhost:5000/bookmarks/${user!.id}/${bookIdToDelete}`, {
        method: "DELETE",
      });
      setBookmarks((prev) => prev.filter((b) => b.id !== bookIdToDelete));
      
      // Menambahkan toast notifikasi setelah berhasil menghapus
      toast.success("Buku berhasil dihapus dari bookmark!", {
        duration: 3000,
        position: "bottom-right",
        style: {
          backgroundColor: '#00758F',
          color: 'white',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#00758F',
        },
      });
    } catch (err) {
      console.error("Gagal menghapus buku dari bookmark:", err);
    } finally {
      // Tutup modal setelah operasi selesai
      setShowConfirmationModal(false);
      setBookIdToDelete(null);
    }
  };

  // Fungsi untuk membatalkan penghapusan
  const handleCancelDelete = () => {
    setShowConfirmationModal(false);
    setBookIdToDelete(null);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FBF7F0]">
        <p className="text-[#2B2C2D] text-xl font-semibold">Memuat bookmark...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FBF7F0] p-6 min-h-screen mt-20">
      <div className="max-w-6xl mx-auto my-10">
        <h1 className="text-3xl font-bold mb-8 text-[#2B2C2D]">Bookmark Saya</h1>

        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <BookmarkSolidIcon className="h-24 w-24 text-[#A9A9A9] mb-4" />
            <p className="text-xl font-semibold text-[#2B2C2D] mb-2">Anda belum memiliki bookmark.</p>
            <p className="text-[#A9A9A9] mb-6">Tambahkan buku-buku yang ingin Anda baca nanti.</p>
            <Link 
              to="/product"
              className="px-6 py-3 bg-[#B58B5C] text-white font-semibold rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
            >
              Jelajahi Buku <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((b) => (
              <div
                key={b.id}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col transform transition-all duration-300 hover:scale-105"
              >
                <div className="flex-1 flex items-start gap-4">
                  {b.thumbnail ? (
                    <img
                      src={b.thumbnail}
                      alt={b.title}
                      className="w-24 h-32 object-cover rounded-lg shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-32 flex items-center justify-center rounded-lg bg-gray-200 text-gray-500 text-sm text-center p-2">
                      No Image
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="font-bold text-lg text-[#2B2C2D] line-clamp-3">{b.title}</h2>
                    {b.authors && (
                      <p className="text-sm text-[#A9A9A9] mt-1">{b.authors.join(", ")}</p>
                    )}
                    {b.price !== undefined && (
                      <p className="font-bold text-md text-[#B58B5C] mt-2">
                        {formatRupiah(b.price)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <button
                    onClick={() => handleDeleteClick(b.id)}
                    className="p-2 text-red-500 rounded-full hover:bg-red-100 transition-colors"
                    aria-label="Hapus dari bookmark"
                  >
                    <BookmarkSolidIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Modal Konfirmasi Hapus */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full mx-auto text-center transform transition-all scale-100 duration-300">
            <h3 className="text-2xl font-bold text-[#2B2C2D] mb-4">Konfirmasi Penghapusan</h3>
            <p className="text-gray-700 mb-6">Apakah Anda yakin ingin menghapus buku ini dari bookmark?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-6 py-2 rounded-lg font-semibold text-[#2B2C2D] border border-gray-300 transition-colors hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2 rounded-lg font-semibold text-white bg-red-600 transition-colors hover:bg-red-700"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
