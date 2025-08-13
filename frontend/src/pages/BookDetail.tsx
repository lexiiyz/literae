import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { type Book } from "../types";
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast';
import { ShoppingCartIcon, BookmarkIcon as BookmarkOutlineIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon, } from '@heroicons/react/24/solid';

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);

export default function BookDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/books/${id}`);
        const data = await res.json();
        setBook(data);
        
        // Memeriksa status bookmark dan cart jika user sudah login
        if (user && data) {
          const bookmarkRes = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/bookmarks/${user.id}`);
          const bookmarks = await bookmarkRes.json();
          setIsBookmarked(bookmarks.some((b: any) => b.id === data.id));

          const cartRes = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/cart/${user.id}`);
          const cartItems = await cartRes.json();
          setIsInCart(cartItems.some((c: any) => c.id === data.id));
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookDetail();
  }, [id, user]);

  const handleBookmark = async () => {
    if (!user || !book) {
      toast.error("Harap login untuk menggunakan fitur ini.");
      return;
    }
    
    try {
      if (isBookmarked) {
        await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/bookmarks/${user.id}/${book.id}`, { method: "DELETE" });
        setIsBookmarked(false);
        toast.success("Buku berhasil dihapus dari bookmark!");
      } else {
        await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/bookmarks/${user.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...book.volumeInfo, id: book.id }),
        });
        setIsBookmarked(true);
        toast.success("Buku berhasil ditambahkan ke bookmark!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal memperbarui bookmark.");
    }
  };

  const handleAddToCart = async () => {
    if (!user || !book) {
      toast.error("Harap login untuk menambahkan ke keranjang.");
      return;
    }
    
    try {
      if (isInCart) {
        toast.error("Buku sudah ada di keranjang!");
        return;
      }

      await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/cart/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...book.volumeInfo, id: book.id, quantity: 1, price: book.saleInfo?.listPrice?.amount || 0 }),
      });
      setIsInCart(true);
      toast.success("Buku berhasil ditambahkan ke keranjang!");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menambahkan ke keranjang.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FBF7F0]">
        <p className="text-[#2B2C2D] text-xl font-semibold">Memuat detail buku...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-[#FBF7F0] p-6">
        <p className="text-[#A9A9A9] text-xl font-semibold">Buku tidak ditemukan.</p>
        <Link to="/product" className="mt-4 text-[#00758F] hover:underline transition-colors">
          ← Kembali ke Halaman Produk
        </Link>
      </div>
    );
  }

  const info = book.volumeInfo;
  const sale = book.saleInfo;

  return (
    <div className="bg-[#FBF7F0] min-h-screen p-6 mt-20">
      <div className="max-w-6xl mx-auto py-10">
        <Link to="/product" className="flex items-center gap-2 text-[#A9A9A9] hover:text-[#2B2C2D] transition-colors mb-8">
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Kembali ke Halaman Produk</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-3xl shadow-xl">
          <div className="flex justify-center items-center p-4">
            <img
              src={info.imageLinks?.thumbnail || "https://placehold.co/300x450/e0e0e0/gray?text=No+Image"}
              alt={info.title}
              className="rounded-xl shadow-2xl lg:h-150 md:h-50vh transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#2B2C2D] mb-4 leading-tight">{info.title}</h1>
            {info.authors && (
              <p className="text-lg md:text-xl text-[#A9A9A9] mb-4">
                by <span className="font-semibold text-[#B58B5C]">{info.authors.join(", ")}</span>
              </p>
            )}

            <div className="space-y-3 text-[#2B2C2D]">
              {info.publisher && (
                <p className="flex items-center gap-2">
                  <span className="font-semibold">Penerbit:</span> {info.publisher}
                </p>
              )}
              {info.publishedDate && (
                <p className="flex items-center gap-2">
                  <span className="font-semibold">Tahun Terbit:</span> {info.publishedDate}
                </p>
              )}
              {info.pageCount && (
                <p className="flex items-center gap-2">
                  <span className="font-semibold">Jumlah Halaman:</span> {info.pageCount}
                </p>
              )}
              {info.categories && (
                <p className="flex items-center gap-2">
                  <span className="font-semibold">Kategori:</span> {info.categories.join(", ")}
                </p>
              )}
            </div>

            {sale?.listPrice && (
              <p className="text-3xl md:text-4xl font-extrabold text-[#00758F] mt-6">
                {formatRupiah(sale.listPrice.amount)}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mt-8 items-center">
              <button
                onClick={handleAddToCart}
                disabled={isInCart}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-semibold transition-colors duration-300
                  ${isInCart ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00758F] hover:bg-[#005f70]'}
                `}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                {isInCart ? "Sudah di Keranjang" : "Tambah ke Keranjang"}
              </button>

              <button
                onClick={handleBookmark}
                className={`p-3 rounded-full transition-colors duration-300
                  ${isBookmarked ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}
                `}
              >
                {isBookmarked ? (
                  <BookmarkSolidIcon className="h-6 w-6" />
                ) : (
                  <BookmarkOutlineIcon className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Synopsis */}
            {info.description && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-[#2B2C2D] mb-3">Sinopsis</h2>
                <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: info.description }}></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
