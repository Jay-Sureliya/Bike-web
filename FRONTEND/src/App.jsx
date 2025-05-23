import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar/Navbar";
import Home from "./component/pages/Home";
import SearchBar from "./component/Navbar/SearchBar";
import Footer from "./component/Footer/Footer";
import ContactPage from "./component/pages/ContactPage";
import AboutPage from "./component/pages/AboutPage";
import NotFoundPage from "./component/pages/NotFoundPage";
import AuthPage from "./component/pages/AuthPage";
import DealerPage from "./component/pages/DealerPage";
import AccessoriesPage from "./component/pages/AccessoriesPage";
import BikePage from "./component/pages/BikePage";
import CartPage from "./component/pages/CartPage";


export function App() {

  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <Router>
      <Navbar onSearchClick={() => setSearchOpen(true)} />
      <SearchBar isVisible={searchOpen} onClose={() => setSearchOpen(false)} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bikes" element={<BikePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/dealers" element={<DealerPage />} />
        <Route path="/accessories" element={<AccessoriesPage />} />
        <Route path="/auth" element={<AuthPage onLogin={() => window.location.href = "/"} />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}
