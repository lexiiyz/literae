import { useEffect, useState, useRef } from "react";
import BookCard from "../components/BookCard";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BookOpenIcon } from "@heroicons/react/24/outline";

const GOOGLE_BOOKS_KEY = "AIzaSyArYlE66HJ8OMZwep4FlUX2Z8s8exFct1Y";

interface Book {
  id: string;
  title: string;
  authors?: string[];
  thumbnail?: string;
  price?: number;
}

const genres = [
  { label: "Semua", query: "" },
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
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [suggestions, setSuggestions] = useState<Book[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const maxResults = 10;

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const fetchBooks = (query: string, selectedGenre: string, pageNumber: number) => {
    setLoading(true);
    const startIndex = (pageNumber - 1) * maxResults;
    let searchQuery = query || "book";
    if (selectedGenre) {
      searchQuery += `+subject:${selectedGenre}`;
    }

    fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&startIndex=${startIndex}&maxResults=${maxResults}&key=${GOOGLE_BOOKS_KEY}`)
      .then(res => res.json())
      .then(data => {
        const items = data.items?.map((item: any) => ({
          id: item.id,
          title: item.volumeInfo.title,
          authors: item.volumeInfo.authors,
          thumbnail: item.volumeInfo.imageLinks?.thumbnail,
          price: Math.floor(Math.random() * (300000 - 50000 + 1) + 50000),
        }));
        setBooks(items || []);
      })
      .finally(() => setLoading(false));
  };

  const fetchSuggestions = (query: string) => {
    if (!query.trim()) return setSuggestions([]);
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5&key=${GOOGLE_BOOKS_KEY}`)
      .then(res => res.json())
      .then(data => {
        const items = data.items?.map((item: any) => ({
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
    if (search.trim()) {
      setPage(1);
      fetchBooks(search, genre, 1);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {Array.from({ length: maxResults }).map((_, i) => (
        <div key={i} className="rounded-xl shadow-md p-4 bg-white animate-pulse" data-aos="fade-up">
          <div className="mb-3 w-full h-40 md:h-60 bg-gray-300 rounded-lg"></div>
          <div className="bg-gray-300 h-4 w-3/4 rounded mb-2"></div>
          <div className="bg-gray-300 h-3 w-1/2 rounded mb-2"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto my-10 min-h-screen mt-25">
      <h1 className="flex items-center gap-2 text-3xl font-bold mb-6 text-[#2B2C2D]">
        <BookOpenIcon className="w-8 h-8 text-[#B58B5C]" /> Product List
      </h1>

      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="genre-select" className="text-lg font-semibold">Genre:</label>
          <select value={genre} onChange={(e) => { setGenre(e.target.value); setPage(1); }}
            className="px-4 py-2 rounded-lg shadow-sm border focus:outline-none">
            {genres.map((g) => (
              <option key={g.query} value={g.query}>{g.label}</option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-1/2" ref={searchRef}>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Cari buku..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); fetchSuggestions(e.target.value); setShowSuggestions(true); }}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              className="border rounded-lg px-4 py-2 w-full"
            />
          </form>
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full bg-white border rounded-lg shadow-lg mt-2 w-full z-10">
              {suggestions.map((s) => (
                <div key={s.id} onClick={() => { setSearch(s.title); fetchBooks(s.title, genre, 1); setShowSuggestions(false); }}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer">
                  <p className="text-sm font-medium">{s.title}</p>
                  {s.authors && <p className="text-xs text-gray-500">by {s.authors.join(", ")}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? renderSkeleton() : (
        books.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} id={book.id} title={book.title} authors={book.authors} thumbnail={book.thumbnail} price={book.price} />
            ))}
          </div>
        ) : <p className="text-center text-gray-500">Tidak ada buku ditemukan.</p>
      )}

      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <button key={i} onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded-lg border ${page === i + 1 ? "bg-[#00758F] text-white" : "bg-white"}`}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
