import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Dialog } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Categories available
const categories = ["All", "Gloves", "Helmet", "Lights"];

function AccessoriesPage() {
  // State variables
  const [accessories, setAccessories] = useState([]); // all accessories fetched from API
  const [selectedCategory, setSelectedCategory] = useState("All"); // filter category
  const [maxPrice, setMaxPrice] = useState(5000); // max price filter
  const [currentPage, setCurrentPage] = useState(0); // current slide page
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // mobile detection
  const [selectedAccessory, setSelectedAccessory] = useState(null); // currently selected accessory for modal
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage or start with empty array
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      return JSON.parse(savedCart);
    } else {
      return [];
    }
  });

  const sliderRef = useRef(null);

  // Update isMobile state on window resize
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch accessories from backend API
  useEffect(() => {
    fetch("https://bike-web.onrender.com/api/accessories")
      .then((response) => response.json())
      .then((data) => setAccessories(data))
      .catch((error) => console.error("Error fetching accessories:", error));
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Filter accessories based on selected category and price
  const filteredAccessories = accessories.filter((item) => {
    const categoryMatch =
      selectedCategory === "All" ||
      item.category?.toLowerCase() === selectedCategory.toLowerCase();
    const priceMatch = item.price <= maxPrice;
    return categoryMatch && priceMatch;
  });

  // Slider settings for react-slick
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index) => setCurrentPage(index),
  };

  // Max number of pages/dots to show in slider navigation
  const totalPages = Math.min(filteredAccessories.length, 4);

  // Called when user clicks a dot below slider
  function handleDotClick(pageIndex) {
    setCurrentPage(pageIndex);
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(pageIndex);
    }
  }

  // Check if user is logged in by checking localStorage
  function isLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
  }

  // Add accessory to cart, only if logged in
  function handleAddToCart(item) {
    if (!isLoggedIn()) {
      toast.error("You must be logged in to add items to cart.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    // Check if item already in cart
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const alreadyInCart = existingCart.some((i) => i._id === item._id);
    if (alreadyInCart) {
      toast.info(`${item.name} is already in your cart.`);
      return;
    }

    // Add item to cart and update localStorage and state
    const updatedCart = [...existingCart, item];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    toast.success(`${item.name} added to cart!`, {
      position: "top-center",
      autoClose: 2000,
    });
  }

  return (
    <div className="mx-auto px-4 py-10 font-sans relative">
      <ToastContainer />

      {/* Filter section */}
      <section className="mb-14">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Explore Accessories</h2>
        <div className="flex flex-wrap gap-10 items-end">
          {/* Category dropdown */}
          <div>
            <label htmlFor="category" className="block mb-2 font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(0);
                if (isMobile && sliderRef.current) {
                  sliderRef.current.slickGoTo(0);
                }
              }}
              className="border border-gray-300 rounded-lg px-4 w-31 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Max price slider */}
          <div className="flex flex-col">
            <label htmlFor="price" className="mb-2 font-medium text-gray-700">
              Max Price: ₹{maxPrice.toLocaleString()}
            </label>
            <input
              id="price"
              type="range"
              min="500"
              max="5000"
              step="100"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setCurrentPage(0);
                if (isMobile && sliderRef.current) {
                  sliderRef.current.slickGoTo(0);
                }
              }}
              className="w-72 accent-red-500"
            />
          </div>
        </div>
      </section>

      {/* Accessories list: slider on mobile, grid on desktop */}
      <section className="py-10 bg-white">
        <div className="md:px-6">
          {filteredAccessories.length === 0 ? (
            <p className="text-center text-gray-500 text-lg mt-20">No accessories found.</p>
          ) : isMobile ? (
            <>
              <Slider ref={sliderRef} {...sliderSettings}>
                {filteredAccessories.slice(0, 10).map((item, index) => (
                  <div key={index}>
                    <AccessoryCard
                      item={item}
                      onView={() => setSelectedAccessory(item)}
                      onAddToCart={() => handleAddToCart(item)}
                    />
                  </div>
                ))}
              </Slider>

              {/* Slider dots */}
              <div className="flex justify-center mt-6">
                <ul className="flex space-x-3">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <li key={i}>
                      <button
                        onClick={() => handleDotClick(i)}
                        className={`w-3 h-3 rounded-full ${
                          currentPage === i ? "bg-gray-900" : "bg-gray-400"
                        }`}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {filteredAccessories.slice(0, 10).map((item, index) => (
                <AccessoryCard
                  key={index}
                  item={item}
                  onView={() => setSelectedAccessory(item)}
                  onAddToCart={() => handleAddToCart(item)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal to show accessory details */}
      {selectedAccessory && (
        <AccessoryModal
          accessory={selectedAccessory}
          onClose={() => setSelectedAccessory(null)}
          onAddToCart={() => handleAddToCart(selectedAccessory)}
        />
      )}
    </div>
  );
}

// Card component for each accessory
function AccessoryCard({ item, onView, onAddToCart }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden">
      <img src={item.image} alt={item.name} className="w-full h-70 object-cover rounded-t-lg" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 truncate">{item.name}</h2>
          <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded-md">
            {item.category || "Accessory"}
          </span>
        </div>
        <p className="text-sm text-gray-600">{item.description}</p>
        <div className="text-red-600 font-semibold text-lg">₹{item.price.toLocaleString()}</div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={onAddToCart}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 rounded-md transition"
          >
            Add to Cart
          </button>
          <button
            onClick={onView}
            className="flex-1 border border-gray-300 hover:bg-gray-100 text-gray-800 text-sm font-semibold py-2 rounded-md transition"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal component to show accessory details with images
function AccessoryModal({ accessory, onClose, onAddToCart }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Use all images if available, else fallback to main image
  const images = accessory.images || [accessory.image];

  // Show previous image
  function prevImage() {
    if (currentImageIndex === 0) {
      setCurrentImageIndex(images.length - 1);
    } else {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  }

  // Show next image
  function nextImage() {
    if (currentImageIndex === images.length - 1) {
      setCurrentImageIndex(0);
    } else {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  }

  return (
    <Dialog open={true} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-40 px-4">
        <Dialog.Panel className="bg-white rounded-xl max-w-lg w-full shadow-xl p-6 relative">
          <Dialog.Title className="text-xl font-bold mb-4">{accessory.name}</Dialog.Title>

          <div className="relative">
            <img
              src={images[currentImageIndex]}
              alt={`${accessory.name} ${currentImageIndex + 1}`}
              className="w-full h-56 object-cover rounded-md"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white rounded-full p-2 hover:bg-opacity-60"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white rounded-full p-2 hover:bg-opacity-60"
                >
                  ›
                </button>
              </>
            )}
          </div>

          <p className="text-sm text-gray-600 my-4">{accessory.description}</p>
          <div className="text-red-600 font-semibold text-lg mb-4">
            ₹{accessory.price.toLocaleString()}
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-red-600 hover:underline">
              Close
            </button>
            <button
              onClick={onAddToCart}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Add to Cart
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default AccessoriesPage;
  