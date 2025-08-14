import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { ShoppingCartIcon, BookmarkIcon as BookmarkOutlineIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

const GOOGLE_BOOKS_KEY = "AIzaSyArYlE66HJ8OMZwep4FlUX2Z8s8exFct1Y";

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const fetchBookDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}?key=${GOOGLE_BOOKS_KEY}`);
        const data = await res.json();
        setBook(data);

        const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
        setIsBookmarked(bookmarks.some((b: any) => b.id === data.id));

        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setIsInCart(cart.some((c: any) => c.id === data.id));
      } catch (err) {
        console.error("Error fetching book:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookDetail();
  }, [id]);

  const handleBookmark = () => {
    if (!book) return;
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    if (isBookmarked) {
      bookmarks = bookmarks.filter((b: any) => b.id !== book.id);
      toast.success("Buku dihapus dari bookmark");
    } else {
      bookmarks.push({ id: book.id, ...book.volumeInfo });
      toast.success("Buku ditambahkan ke bookmark");
    }
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    setIsBookmarked(!isBookmarked);
  };

  const handleAddToCart = () => {
    if (!book) return;
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (isInCart) {
      toast.error("Buku sudah di keranjang");
      return;
    }
    cart.push({
      id: book.id,
      ...book.volumeInfo,
      quantity: 1,
      price: book.saleInfo?.listPrice?.amount || Math.floor(Math.random() * (200000 - 50000) + 50000)
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    setIsInCart(true);
    toast.success("Buku ditambahkan ke keranjang");
  };

  const renderSkeleton = () => (
    <div className="p-6 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-gray-300 mb-4 animate-pulse">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow-lg animate-pulse">
          <div className="w-full h-96 bg-gray-300 rounded-xl"></div>
          <div className="flex flex-col gap-4">
            <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            <div className="h-5 bg-gray-300 rounded w-1/2"></div>
            <div className="h-6 bg-gray-300 rounded w-1/4 mt-4"></div>
            <div className="flex gap-4 mt-6">
              <div className="flex-1 h-10 bg-gray-300 rounded-lg"></div>
              <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            </div>
            <div className="mt-6 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return renderSkeleton();
  if (!book) return <p className="text-center mt-20">Buku tidak ditemukan</p>;

  const info = book.volumeInfo;
  const sale = book.saleInfo;

  return (
    <div className="p-6 mt-20">
      <div className="max-w-6xl mx-auto">
        <Link to="/product" className="flex items-center gap-2 text-gray-500 mb-4">
          <ArrowLeftIcon className="h-4 w-4" /> Kembali
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow-lg">
          <img src={info.imageLinks?.thumbnail || "https://placehold.co/300x450"} alt={info.title} className="rounded-xl h-full" />
          <div>
            <h1 className="text-3xl font-bold">{info.title}</h1>
            {info.authors && <p className="text-lg text-gray-500">by {info.authors.join(", ")}</p>}
            {sale?.listPrice && <p className="text-2xl text-[#00758F] font-bold mt-4">{formatRupiah(sale.listPrice.amount)}</p>}

            <div className="flex gap-4 mt-6">
              <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#00758F] text-white rounded-lg">
                <ShoppingCartIcon className="h-5 w-5" /> {isInCart ? "Sudah di Keranjang" : "Tambah ke Keranjang"}
              </button>
              <button onClick={handleBookmark} className={`p-3 rounded-full ${isBookmarked ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {isBookmarked ? <BookmarkSolidIcon className="h-6 w-6" /> : <BookmarkOutlineIcon className="h-6 w-6" />}
              </button>
            </div>

            {info.description && <div className="mt-6" dangerouslySetInnerHTML={{ __html: info.description }} />}
          </div>
        </div>
      </div>
    </div>
  );
}
