import React, { useState } from 'react';
import { FaBars, FaTimes, FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onSearchClick}) => {
  const [isOpen, setIsOpen] = useState(false); // Controls mobile menu open/close
  const navigate = useNavigate();

  // List of navigation links
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Bikes', path: '/bikes' },
    { name: 'Accessories', path: '/accessories' },
    { name: 'Dealers', path: '/dealers' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  // Function to toggle mobile menu open/close
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-black text-white sticky top-0 z-50 shadow-md">
      <div className="pt-5 md:pt-0 max-w-7xl mx-auto px-4 flex justify-between items-center md:h-16">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold flex gap-1">
          <span className="text-red-500">Bike</span>
          <span className="italic">Zone</span>
        </Link>

        {/* Desktop Menu (shown only on medium and larger screens) */}
        <div className="hidden md:flex space-x-6 text-sm font-semibold uppercase">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="hover:text-red-400 transition"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Icons (Search, User, Cart) */}
        <div className="hidden md:flex space-x-4 text-lg">
          <button onClick={onSearchClick} className="hover:text-red-400">
            <FaSearch />
          </button>
          <button onClick={() => navigate('/auth')} className="hover:text-red-400">
            <FaUser />
          </button>
          <button onClick={() => navigate('/cart')} className="hover:text-red-400">
            <FaShoppingCart />
          </button>
        </div>

        {/* Mobile Menu Toggle Button (only visible on small screens) */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (shown when isOpen is true) */}
      <div
        className={`md:hidden bg-black px-4 pb-4 text-sm font-semibold transition-all duration-300 ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        {/* Mobile Links */}
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="block py-1 hover:text-red-400"
            onClick={() => setIsOpen(false)} // Close menu on click
          >
            {link.name}
          </Link>
        ))}

        {/* Mobile Login & Cart */}
        <div className="pt-2 border-t border-gray-700 flex flex-col gap-2 mt-2">
          <Link
            to="/auth"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 hover:text-red-400"
          >
            <FaUser /> Login
          </Link>
          <Link
            to="/cart"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 hover:text-red-400"
          >
            <FaShoppingCart /> Cart
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
