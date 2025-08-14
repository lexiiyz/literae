import { useEffect, useState } from "react";
import { TrashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { Link } from "react-router-dom";

interface CartItem {
  id: string;
  title: string;
  authors?: string[];
  thumbnail?: string;
  price?: number;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [bookIdToDelete, setBookIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  const handleDeleteClick = (bookId: string) => {
    setBookIdToDelete(bookId);
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = () => {
    if (!bookIdToDelete) return;
    const updated = cart.filter((c) => c.id !== bookIdToDelete);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    setShowConfirmationModal(false);
    setBookIdToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmationModal(false);
    setBookIdToDelete(null);
  };

  const handleQuantityChange = (bookId: string, quantity: number) => {
    if (quantity < 1) return;
    const updated = cart.map((c) => c.id === bookId ? { ...c, quantity } : c);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

  const totalHarga = cart.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);

  return (
    <div className="bg-[#FBF7F0] p-6 min-h-screen mt-20">
      <div className="max-w-6xl mx-auto my-10">
        <h1 className="text-3xl font-bold mb-8 text-[#2B2C2D]">Keranjang Saya</h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <ShoppingBagIcon className="h-24 w-24 text-[#A9A9A9] mb-4" />
            <p className="text-xl font-semibold text-[#2B2C2D] mb-2">Keranjang belanja Anda kosong.</p>
            <p className="text-[#A9A9A9] mb-6">Tambahkan buku favorit Anda.</p>
            <Link to="/product" className="px-6 py-3 bg-[#00758F] text-white font-semibold rounded-full shadow-lg hover:scale-105">
              Jelajahi Buku
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {cart.map((c) => (
              <div key={c.id} className="bg-white p-6 rounded-2xl shadow-lg grid md:grid-cols-2 gap-8 items-center">
                <div className="flex items-center gap-6">
                  {c.thumbnail ? (
                    <img src={c.thumbnail} alt={c.title} className="w-24 h-32 object-cover rounded-lg shadow-md" />
                  ) : (
                    <div className="w-24 h-32 flex items-center justify-center rounded-lg bg-gray-200 text-gray-500">No Image</div>
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-xl text-[#2B2C2D]">{c.title}</p>
                    <p className="text-sm text-[#A9A9A9]">{c.authors?.join(", ")}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-end gap-6">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleQuantityChange(c.id, c.quantity - 1)} className="p-1 w-8 h-8 rounded-full bg-gray-200">-</button>
                    <input
                      type="number"
                      value={c.quantity}
                      min={1}
                      onChange={(e) => handleQuantityChange(c.id, parseInt(e.target.value))}
                      className="w-12 text-center border-b-2"
                    />
                    <button onClick={() => handleQuantityChange(c.id, c.quantity + 1)} className="p-1 w-8 h-8 rounded-full bg-gray-200">+</button>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="font-bold text-2xl text-[#B58B5C]">{formatRupiah((c.price || 0) * c.quantity)}</p>
                    <button onClick={() => handleDeleteClick(c.id)} className="p-2 text-red-500 rounded-full hover:bg-red-100">
                      <TrashIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center mt-10 p-8 bg-white rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold text-[#2B2C2D]">Total Harga</h2>
              <p className="text-3xl font-bold text-[#00758F]">{formatRupiah(totalHarga)}</p>
            </div>
          </div>
        )}
      </div>

      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
            <h3 className="text-2xl font-bold text-[#2B2C2D] mb-4">Konfirmasi Hapus</h3>
            <p className="text-gray-700 mb-6">Yakin ingin menghapus buku ini dari keranjang?</p>
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
