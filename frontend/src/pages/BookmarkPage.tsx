import { useEffect, useState } from "react";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
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
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [bookIdToDelete, setBookIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setBookmarks(savedBookmarks);
  }, []);

  const handleDeleteClick = (bookId: string) => {
    setBookIdToDelete(bookId);
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = () => {
    if (!bookIdToDelete) return;
    const updated = bookmarks.filter((b) => b.id !== bookIdToDelete);
    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));

    toast.success("Buku berhasil dihapus dari bookmark!", {
      duration: 3000,
      position: "bottom-right",
      style: { backgroundColor: '#00758F', color: 'white' },
    });

    setShowConfirmationModal(false);
    setBookIdToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmationModal(false);
    setBookIdToDelete(null);
  };

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
              className="px-6 py-3 bg-[#B58B5C] text-white font-semibold rounded-full shadow-lg hover:scale-105 flex items-center gap-2"
            >
              Jelajahi Buku <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((b) => (
              <div key={b.id} className="bg-white p-6 rounded-2xl shadow-lg flex flex-col hover:scale-105 transition-all">
                <div className="flex gap-4">
                  {b.thumbnail ? (
                    <img src={b.thumbnail} alt={b.title} className="w-24 h-32 object-cover rounded-lg shadow-md" />
                  ) : (
                    <div className="w-24 h-32 flex items-center justify-center rounded-lg bg-gray-200 text-gray-500">No Image</div>
                  )}
                  <div className="flex-1">
                    <h2 className="font-bold text-lg text-[#2B2C2D] line-clamp-3">{b.title}</h2>
                    {b.authors && <p className="text-sm text-[#A9A9A9] mt-1">{b.authors.join(", ")}</p>}
                    {b.price !== undefined && (
                      <p className="font-bold text-md text-[#B58B5C] mt-2">{formatRupiah(b.price)}</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <button
                    onClick={() => handleDeleteClick(b.id)}
                    className="p-2 text-red-500 rounded-full hover:bg-red-100"
                  >
                    <BookmarkSolidIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
            <h3 className="text-2xl font-bold text-[#2B2C2D] mb-4">Konfirmasi Hapus</h3>
            <p className="text-gray-700 mb-6">Yakin ingin menghapus buku ini?</p>
            <div className="flex justify-center gap-4">
              <button onClick={handleCancelDelete} className="px-6 py-2 rounded-lg font-semibold border hover:bg-gray-100">Batal</button>
              <button onClick={handleConfirmDelete} className="px-6 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
