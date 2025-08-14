import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { HomeIcon, BookOpenIcon, ShoppingCartIcon, BookmarkIcon, GlobeAltIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleScroll = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false);
      } else if (window.scrollY < lastScrollY || window.scrollY < 100) {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [lastScrollY]);

  const navItems = [
    { name: "Home", to: "/", icon: HomeIcon },
    { name: "Produk", to: "/product", icon: BookOpenIcon },
    { name: "Tentang", to: "/about", icon: GlobeAltIcon },
    { name: "Keranjang", to: "/cart", icon: ShoppingCartIcon },
    { name: "Bookmark", to: "/bookmark", icon: BookmarkIcon },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 h-20 transition-all duration-300 ease-in-out transform
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        px-20 py-4 hidden md:flex justify-between items-center shadow-md`}
        style={{ backgroundColor: "#FBF7F0" }}
      >
        <NavLink to="/" className="text-2xl font-bold text-[#2B2C2D] flex items-center gap-2">
          <img src="./literae.png" alt="Logo" className="w-15 h-15" />
        </NavLink>

        <div className="flex gap-6 items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center group relative text-[#2B2C2D] transition-colors duration-200
                ${isActive ? 'text-[#B58B5C]' : 'hover:text-[#B58B5C]'}`
              }
            >
              <item.icon className="h-6 w-6 transition-transform duration-200 group-hover:-translate-y-1" />
              <span className="absolute -bottom-6 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-semibold">
                {item.name}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 flex md:hidden justify-between items-center px-6 py-4 shadow-md" style={{ backgroundColor: "#FBF7F0" }}>
        <NavLink to="/" className="text-2xl font-bold text-[#2B2C2D] flex items-center gap-2">
          <img src="./literae.svg" alt="logo" className="w-12 h-12" />
        </NavLink>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-[#2B2C2D]">
          <Bars3Icon className="h-7 w-7" />
        </button>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ backgroundColor: "rgba(43, 44, 45, 0.5)" }}
        onClick={() => setIsSidebarOpen(false)}
      >
        <div
          className="w-3/4 max-w-sm h-full bg-[#FBF7F0] p-6 shadow-2xl overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-[#2B2C2D]">Menu</h3>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-[#2B2C2D]">
              <XMarkIcon className="h-7 w-7" />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 text-lg font-semibold px-4 py-2 rounded-lg transition-colors duration-200
                  ${isActive ? 'bg-[#B58B5C] text-white' : 'text-[#2B2C2D] hover:bg-gray-200'}`
                }
              >
                <item.icon className="h-6 w-6" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
