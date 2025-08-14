import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { type Book } from "../types";
import BookCard from "../components/BookCard";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from "react-router-dom";
import { BookOpenIcon } from "@heroicons/react/24/solid";

// API key langsung di-embed untuk dummy project
const GOOGLE_BOOKS_KEY = "AIzaSyArYlE66HJ8OMZwep4FlUX2Z8s8exFct1Y";

// ...import dan konstanta yang sudah ada tetap sama
export default function Home() {
  const [bestSellers, setBestSellers] = useState<Book[]>([]);
  const [featured, setFeatured] = useState<Record<string, Book[]>>({
    classics: [],
    newArrivals: [],
    curated: [],
  });
  const [bookOfTheDay, setBookOfTheDay] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingBotd, setLoadingBotd] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
    AOS.refresh();

    const fetchBooks = async (query: string) => {
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&key=${GOOGLE_BOOKS_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      return data.items || [];
    };

    const loadData = async () => {
      setLoading(true);
      try {
        const [best, classics, newArrivals, curated] = await Promise.all([
          fetchBooks("bestseller"),
          fetchBooks("classics"),
          fetchBooks("new books"),
          fetchBooks("recommended"),
        ]);

        setBestSellers(best.slice(0, 4));
        setFeatured({
          classics: classics.slice(0, 4),
          newArrivals: newArrivals.slice(0, 4),
          curated: curated.slice(0, 4),
        });
      } catch (err) {
        console.error("Failed to fetch books:", err);
      } finally {
        setLoading(false);
      }
    };

    const loadBookOfTheDay = async () => {
      setLoadingBotd(true);
      try {
        const candidates = await fetchBooks("fiction OR novel OR literature");
        const randomBook = candidates[Math.floor(Math.random() * candidates.length)];
        setBookOfTheDay(randomBook);
      } catch (err) {
        console.error("Failed to fetch Book of The Day:", err);
      } finally {
        setLoadingBotd(false);
      }
    };

    loadData();
    loadBookOfTheDay();
  }, []);

  const getPrice = (book: Book) => {
    return (
      book.saleInfo?.listPrice?.amount ||
      Math.floor(Math.random() * (200000 - 50000) + 50000)
    );
  };

  const renderBooks = (books: Book[]) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          id={book.id}
          title={book.volumeInfo.title}
          authors={book.volumeInfo.authors}
          thumbnail={book.volumeInfo.imageLinks?.thumbnail}
          price={getPrice(book)}
        />
      ))}
    </div>
  );

  const renderSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[...Array(4)].map((_, idx) => (
        <motion.div
          key={idx}
          className="p-4 rounded-lg shadow-md bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
        >
          <div className="w-full h-40 md:h-60 bg-[#A9A9A9] rounded mb-4 animate-pulse"></div>
          <div className="h-4 bg-[#A9A9A9] rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-[#A9A9A9] rounded w-1/2 animate-pulse"></div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div>
      {/* Hero */}
      <motion.section
        className="text-center py-50 px-6 bg-cover bg-center mt-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1512820790803-83ca734da794')",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        data-aos="fade-down"
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-[#FBF7F0] drop-shadow-md">
          Selamat Datang di <span className="text-[#B58B5C]">Literae</span>
        </h1>
        <p className="text-sm md:text-lg max-w-2xl mx-auto mb-6 text-[#FBF7F0] drop-shadow-sm">
          Setiap buku punya cerita. Mari temukan cerita yang menanti untuk kamu baca.
        </p>
        <motion.a
          href="/product"
          className="px-6 py-3 rounded-lg text-lg font-semibold shadow-md inline-block text-[#FBF7F0]"
          style={{ backgroundColor: "#00758F" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Jelajahi Koleksi
        </motion.a>
      </motion.section>

      <main>
        {/* Book of The Day */}
        <section className="max-w-6xl mx-auto py-16 px-6" data-aos="fade-up">
          <h1 className="flex items-center gap-2 text-3xl font-bold mb-6 text-[#2B2C2D]">
            <BookOpenIcon className="w-8 h-8 text-[#B58B5C]" /> Product List
          </h1>
          {loadingBotd ? (
            <div className="h-60 bg-gray-200 rounded-lg animate-pulse"></div>
          ) : bookOfTheDay ? (
            <div className="flex flex-col md:flex-row gap-6 bg-white rounded-lg shadow-lg p-6">
              <img
                src={bookOfTheDay.volumeInfo.imageLinks?.thumbnail}
                alt={bookOfTheDay.volumeInfo.title}
                className="w-full md:w-48 object-cover rounded-lg"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">{bookOfTheDay.volumeInfo.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {bookOfTheDay.volumeInfo.authors?.join(", ")}
                  </p>
                  <p className="text-gray-700 line-clamp-4">
                    {bookOfTheDay.volumeInfo.description || "Tidak ada deskripsi"}
                  </p>
                </div>
                <div className="mt-4">
                <Link
                    to={`/book/${bookOfTheDay.id}`}
                    className="px-4 py-2 rounded-lg text-white bg-[#B58B5C] hover:bg-[#a07b52] transition-colors"
                >
                    Lihat Detail
                </Link>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Gagal memuat Book of The Day.</p>
          )}
        </section>

        {/* Rekomendasi */}
        <section className="max-w-6xl mx-auto py-16 px-6" data-aos="fade-up">
          <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: "#2B2C2D" }}>
            Rekomendasi
          </h2>
          {Object.entries(featured).map(([key, books]) => (
            <div key={key} className="mb-10">
              <h3 className="text-xl font-semibold mb-4 capitalize" style={{ color: "#2B2C2D" }}>
                {key === "newArrivals"
                  ? "Baru"
                  : key === "curated"
                  ? "Pilihan Kurator"
                  : "Klasik"}
              </h3>
              {loading ? renderSkeleton() : renderBooks(books)}
            </div>
          ))}
        </section>

        {/* Best Seller */}
        <section className="max-w-6xl mx-auto py-16 px-6" data-aos="fade-up">
          <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: "#2B2C2D" }}>
            Best Seller
          </h2>
          {loading ? renderSkeleton() : renderBooks(bestSellers)}
        </section>
        <motion.section className="bg-white py-16 px-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} data-aos="zoom-in" > <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center" style={{ color: "#2B2C2D" }} > Apa Kata Pembaca Kami </h2> <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"> {[ "Pengiriman cepat dan buku-buku asli!", "Buku-buku dikemas rapi, pengiriman super cepat.", "Koleksi sangat lengkap, sangat direkomendasikan!", ].map((quote, i) => ( <motion.div key={i} className="p-6 rounded-lg shadow-md" style={{ backgroundColor: "#FBF7F0" }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }} > <p className="italic" style={{ color: "#2B2C2D" }}> “{quote}” </p> <p className="mt-4 text-sm" style={{ color: "#A9A9A9" }}> - Pelanggan {i + 1} </p> </motion.div> ))} </div> </motion.section> <section className="max-w-6xl mx-auto py-16 px-6" data-aos="fade-up"> <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "#2B2C2D" }}> Tentang Literae </h2> <p className="mb-4 text-gray-700"> Literae adalah destinasi online Anda untuk menemukan buku-buku terbaik dari berbagai genre dan kategori. Kami percaya bahwa setiap buku memiliki cerita unik dan kekuatan untuk menginspirasi. Di sini, Anda bisa menjelajahi koleksi terbaik kami, mulai dari best seller, buku klasik yang tidak kalah akan waktu , hingga buku-buku pendatang baru. </p> <p className="text-gray-700"> Selain menjadi toko buku, kami juga menyajikan ulasan mendalam dan artikel menarik dari blog kami. Bergabunglah dengan komunitas pembaca kami dan temukan petualangan literasi Anda selanjutnya. </p> </section>
      </main>
    </div>
  );
}
