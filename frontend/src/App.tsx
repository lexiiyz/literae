import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Product from "./pages/Product";
import About from "./pages/About";
import BookDetail from "./pages/BookDetail";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import BookmarkPage from "./pages/BookmarkPage";
import ProfilePage from "./pages/ProfilePage";
import Footer from "./components/Footer";
import { Toaster } from 'react-hot-toast';
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FBF7F0]">
      <Router>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<Product />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/bookmark" element={<BookmarkPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
      <Toaster />
    </div>
  );
}
