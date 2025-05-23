import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const categories = ["All", "Mountain", "Road"];

const BikePage = () => {
    const [bikes, setBikes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [maxPrice, setMaxPrice] = useState(210000);
    const [currentPage, setCurrentPage] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const sliderRef = useRef(null);
    const [selectedBike, setSelectedBike] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(storedCart);
    }, []);

    const isLoggedIn = () => {
        return localStorage.getItem("isLoggedIn") === "true";
    };

    const handleAddToCart = (bike) => {
        if (!isLoggedIn()) {
            toast.error("You must be logged in to add items to cart.", {
                position: "top-center",
                autoClose: 3000,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
        const alreadyInCart = existingCart.some((item) => item._id === bike._id);
        if (alreadyInCart) {
            toast.info(`${bike.name} is already in your cart.`);
            return;
        }

        const updatedCart = [...existingCart, bike];
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        toast.success(`${bike.name} added to cart!`, {
            position: "top-center",
            autoClose: 2000,
        });
    };

    const handleViewDetails = (bike) => {
        setSelectedBike(bike);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedBike(null);
    };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        fetch("http://localhost:3000/api/bikes")
            .then((res) => res.json())
            .then((data) => setBikes(data))
            .catch((err) => console.error("Error fetching bikes:", err));
    }, []);

    const filteredBikes = bikes.filter((bike) => {
        const matchCategory =
            selectedCategory === "All" ||
            bike.category?.toLowerCase() === selectedCategory.toLowerCase();
        const matchPrice = bike.price <= maxPrice;
        return matchCategory && matchPrice;
    });

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: (index) => setCurrentPage(index),
    };

    const totalPages = Math.min(filteredBikes.length, 4);

    const handleDotClick = (pageIndex) => {
        setCurrentPage(pageIndex);
        sliderRef.current?.slickGoTo(pageIndex);
    };

    return (
        <div className="mx-auto px-4 py-10 font-sans">
            <ToastContainer />
            {/* Filter */}
            <section className="mb-16">
                <h2 className="text-4xl font-bold text-gray-800 mb-8">Find Your Ride</h2>
                <div className="flex flex-wrap gap-10 items-end">
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Category</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setCurrentPage(0);
                                if (isMobile) sliderRef.current?.slickGoTo(0);
                            }}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 font-medium text-gray-700">
                            Max Price: ₹{maxPrice.toLocaleString()}
                        </label>
                        <input
                            type="range"
                            min="100000"
                            max="210000"
                            step="5000"
                            value={maxPrice}
                            onChange={(e) => {
                                setMaxPrice(Number(e.target.value));
                                setCurrentPage(0);
                                if (isMobile) sliderRef.current?.slickGoTo(0);
                            }}
                            className="w-72 accent-red-500"
                        />
                    </div>
                </div>
            </section>

            {/* Bike Cards or Slider */}
            <section className="py-12 bg-white">
                <div className="md:px-6">
                    {filteredBikes.length === 0 ? (
                        <p className="text-center text-gray-500 text-lg mt-20">No bikes found.</p>
                    ) : isMobile ? (
                        <>
                            <Slider ref={sliderRef} {...settings}>
                                {filteredBikes.map((bike, index) => (
                                    <div key={index} className="px-2">
                                        <BikeCard bike={bike} handleAddToCart={handleAddToCart} handleViewDetails={handleViewDetails} />
                                    </div>
                                ))}
                            </Slider>
                            <div className="flex justify-center mt-6">
                                <ul className="flex space-x-3">
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <li key={i}>
                                            <button
                                                onClick={() => handleDotClick(i)}
                                                className={`w-3 h-3 rounded-full ${currentPage === i ? "bg-gray-900" : "bg-gray-400"}`}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {filteredBikes.map((bike, index) => (
                                <BikeCard
                                    key={index}
                                    bike={bike}
                                    handleAddToCart={handleAddToCart}
                                    handleViewDetails={handleViewDetails}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Modal */}
            {showModal && selectedBike && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4 py-6"
                    onClick={closeModal}  // close modal when clicking outside the modal box
                >
                    <div
                        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8"
                        onClick={(e) => e.stopPropagation()} // prevent modal close when clicking inside modal box
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-3xl sm:text-4xl font-bold focus:outline-none"
                            aria-label="Close modal"
                        >
                            &times;
                        </button>

                        <h3 className="text-xl sm:text-4xl font-extrabold text-gray-900 mb-6 sm:mb-8">{selectedBike.name}</h3>

                        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
                            <img
                                src={selectedBike.image}
                                alt={selectedBike.name}
                                className="w-full sm:w-1/2 h-64 sm:h-auto object-cover rounded-xl shadow-lg"
                                loading="lazy"
                            />
                            <div className="flex flex-col justify-between flex-1 text-gray-800">
                                <div className="space-y-4 sm:space-y-5 text-sm sm:text-base">
                                    <p><strong>Category:</strong> {selectedBike.category}</p>
                                    <p>
                                        <strong>Price:</strong>{" "}
                                        <span className="text-red-600 font-bold text-xl sm:text-2xl">
                                            ₹{selectedBike.price.toLocaleString()}
                                        </span>
                                    </p>
                                    <p><strong>Color:</strong> {selectedBike.color}</p>
                                    <p className="flex items-center gap-2">
                                        <strong>Rating:</strong>
                                        <span className="text-yellow-400 font-semibold">{selectedBike.rating.toFixed(1)} / 5</span>
                                        <span className="text-yellow-400 text-lg sm:text-xl">
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <span key={i}>{i < Math.floor(selectedBike.rating) ? "★" : "☆"}</span>
                                            ))}
                                        </span>
                                    </p>
                                    <p className="text-green-600 font-semibold">
                                        EMI from ₹{Math.round(selectedBike.price / 24).toLocaleString()} /mo
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleAddToCart(selectedBike)}
                                    className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-md transition w-full sm:w-auto text-center"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

const BikeCard = ({ bike, handleAddToCart, handleViewDetails }) => (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
        <img src={bike.image} alt={bike.name} className="w-full h-52 object-cover rounded-t-lg" />
        <div className="p-5 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 truncate">{bike.name}</h2>
            <div className="flex justify-between text-gray-700">
                <span className="font-medium">Price:</span>
                <span className="font-semibold text-red-600">₹{bike.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-700">
                <span className="font-medium">Color:</span>
                <span className="capitalize font-semibold">{bike.color}</span>
            </div>
            <div className="flex items-center text-yellow-400 text-sm group relative">
                {Array.from({ length: 5 }, (_, i) => (
                    <span key={i}>{i < Math.floor(bike.rating) ? "★" : "☆"}</span>
                ))}
                <span className="ml-2 text-xs group-hover:opacity-100 opacity-0 absolute -top-6 left-0 bg-gray-800 text-white px-2 py-1 rounded text-[10px] transition-opacity">
                    Rating: {bike.rating.toFixed(1)} / 5
                </span>
            </div>
            <div className="text-green-600 text-sm font-semibold">
                EMI starts at ₹{Math.round(bike.price / 24).toLocaleString()} /mo
            </div>
            <div className="flex gap-3 mt-4">
                <button
                    onClick={() => handleAddToCart(bike)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 rounded-md transition"
                >
                    Add to Cart
                </button>
                <button
                    onClick={() => handleViewDetails(bike)}
                    className="flex-1 border border-gray-300 hover:bg-gray-100 text-gray-800 text-sm font-semibold py-2 rounded-md transition"
                >
                    View Details
                </button>
            </div>
        </div>
    </div>
);

export default BikePage;
