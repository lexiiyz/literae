import { Link } from "react-router-dom";
import 'aos/dist/aos.css';
import toast from 'react-hot-toast';

interface BookCardProps {
  id: string;
  title: string;
  authors?: string[];
  thumbnail?: string;
  price?: number;
  className?: string;
}

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);

export default function BookCard({
  id,
  title,
  authors,
  thumbnail,
  price,
  className = "",
}: BookCardProps) {

  const handleBookmark = () => {
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    if (bookmarks.some((b: any) => b.id === id)) {
      toast.error("Buku sudah ada di bookmark!");
      return;
    }
    bookmarks.push({ id, title, authors, thumbnail, price });
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    toast.success("Buku ditambahkan ke bookmark!", {
      duration: 3000,
      position: "top-center",
      style: { backgroundColor: '#B58B5C', color: 'white' }
    });
  };

  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.some((c: any) => c.id === id)) {
      toast.error("Buku sudah ada di keranjang!");
      return;
    }
    cart.push({ id, title, authors, thumbnail, price, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Buku ditambahkan ke keranjang!", {
      duration: 3000,
      position: "top-center",
      style: { backgroundColor: '#00758F', color: 'white' }
    });
  };

  return (
    <div
      className={`relative rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out p-4 flex flex-col bg-white ${className}`}
      data-aos="fade-up"
    >
      <Link to={`/book/${id}`}>
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="mb-3 w-full h-40 md:h-60 object-cover rounded-lg"
          />
        ) : (
          <div
            className="mb-3 w-full h-40 md:h-60 flex items-center justify-center rounded-lg text-lg font-semibold text-white"
            style={{ backgroundColor: "#A9A9A9" }}
          >
            No Image
          </div>
        )}
      </Link>
      <h2 className="font-semibold text-sm line-clamp-2 flex-1" style={{ color: "#2B2C2D" }}>
        {title}
      </h2>
      {authors && (
        <p className="text-xs line-clamp-1" style={{ color: "#A9A9A9" }}>
          {authors.join(", ")}
        </p>
      )}
      {price !== undefined && (
        <p className="font-bold mt-2" style={{ color: "#B58B5C" }}>
          {formatRupiah(price)}
        </p>
      )}

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleBookmark}
          className="flex-1 py-2 rounded-lg text-white font-semibold transform transition-all duration-300 ease-in-out hover:scale-105"
          style={{ backgroundColor: "#B58B5C" }}
        >
          <svg
            className="w-5 h-5 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
        <button
          onClick={handleAddToCart}
          className="flex-1 py-2 rounded-lg text-white font-semibold transform transition-all duration-300 ease-in-out hover:scale-105"
          style={{ backgroundColor: "#00758F" }}
        >
          <svg
            className="w-5 h-5 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
