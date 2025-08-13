import { useEffect, useState, useRef } from "react";
import BookCard from "../components/BookCard";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BookOpenIcon } from "@heroicons/react/24/outline";

interface Book {
  id: string;
  title: string;
  authors?: string[];
  thumbnail?: string;
  price?: number;
}

const genres = [
  { label: "Semua", query: "all" },
  { label: "Programming", query: "programming" },
  { label: "Fiksi", query: "fiction" },
  { label: "Science", query: "science" },
  { label: "Bisnis", query: "business" },
  { label: "Edukasi", query: "education" },
  { label: "Classic", query: "classic" },
  { label: "Non-Fiksi", query: "nonfiction" },
  { label: "Novel", query: "novel" }
];

export default function Product() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [suggestions, setSuggestions] = useState<Book[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const maxResults = 10;

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const fetchBooks = (query: string, selectedGenre: string, pageNumber: number) => {
    setLoading(true);
    const startIndex = (pageNumber - 1) * maxResults;

    fetch(
      `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/books?q=${encodeURIComponent(query)}&genre=${selectedGenre}&startIndex=${startIndex}&maxResults=${maxResults}`
    )
      .then((res) => res.json())
      .then((data) => {
        const items = data.items?.map((item: any) => ({
          id: item.id,
          title: item.volumeInfo.title,
          authors: item.volumeInfo.authors,
          thumbnail: item.volumeInfo.imageLinks?.thumbnail,
          price: Math.floor(Math.random() * (300000 - 50000 + 1) + 50000),
        }));
        setBooks(items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchSuggestions = (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/books?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        const items = data.items?.slice(0, 5).map((item: any) => ({
          id: item.id,
          title: item.volumeInfo.title,
          authors: item.volumeInfo.authors,
        }));
        setSuggestions(items || []);
      });
  };

  useEffect(() => {
    fetchBooks(search || "book", genre, page);
  }, [genre, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim() !== "") {
      setPage(1);
      fetchBooks(search, genre, 1);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {Array.from({ length: maxResults }).map((_, i) => (
        <div
          key={i}
          className="relative rounded-xl shadow-md p-4 flex flex-col bg-white animate-pulse"
          data-aos="fade-up"
        >
          <div className="mb-3 w-full h-40 md:h-60 bg-gray-300 rounded-lg"></div>
          <div className="bg-gray-300 h-4 w-3/4 rounded mb-2"></div>
          <div className="bg-gray-300 h-3 w-1/2 rounded mb-2"></div>
          <div className="bg-gray-300 h-4 w-1/3 rounded mt-2"></div>
          <div className="flex gap-2 mt-4">
            <div className="flex-1 py-2 rounded-lg bg-gray-300"></div>
            <div className="flex-1 py-2 rounded-lg bg-gray-300"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto my-10 min-h-screen mt-25">
      <h1 className="flex items-center gap-2 text-3xl font-bold mb-6 text-[#2B2C2D]">
        <BookOpenIcon className="w-8 h-8 text-[#B58B5C]" /> {/* Ganti icon */}
        Product List
      </h1>

      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <label
            htmlFor="genre-select"
            className="text-lg text-[#2B2C2D] font-semibold"
          >
            Genre:
          </label>
          <select
            id="genre-select"
            value={genre}
            onChange={(e) => {
              setGenre(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded-lg shadow-sm border border-[#A9A9A9] focus:outline-none focus:ring-2 focus:ring-[#B58B5C] transition-all duration-200 cursor-pointer text-[#2B2C2D] font-medium bg-white hover:border-[#B58B5C]"
            style={{ borderColor: "#A9A9A9" }}
          >
            {genres.map((g) => (
              <option
                key={g.query}
                value={g.query}
                className="bg-white text-[#2B2C2D] hover:bg-[#F7F2EC]"
              >
                {g.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-1/2" ref={searchRef}>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Cari buku berdasarkan judul atau penulis..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                fetchSuggestions(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              className="border border-[#A9A9A9] rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#B58B5C] transition-all duration-200"
            />
            {search.trim() && (
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 rounded-r-lg bg-[#B58B5C] text-white hover:bg-[#a17a50] transition-colors"
                aria-label="Search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </button>
            )}
          </form>
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full bg-white border border-[#A9A9A9] rounded-lg shadow-lg mt-2 w-full z-10 max-h-60 overflow-y-auto">
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setSearch(s.title);
                    setShowSuggestions(false);
                    fetchBooks(s.title, genre, 1);
                  }}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <p className="text-sm font-medium text-[#2B2C2D]">{s.title}</p>
                  {s.authors && (
                    <p className="text-xs text-gray-500">
                      by {s.authors.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading && renderSkeleton()}

      {!loading && books.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              authors={book.authors}
              thumbnail={book.thumbnail}
              price={book.price}
            />
          ))}
        </div>
      )}

      {!loading && books.length === 0 && (
        <p className="text-center text-[#A9A9A9]">Tidak ada buku ditemukan.</p>
      )}

      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded-lg border transition-all duration-200 font-semibold ${
              page === i + 1
                ? "bg-[#00758F] text-white border-[#00758F] shadow-md"
                : "bg-[#FFFFFF] text-[#2B2C2D] border-[#A9A9A9] hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
