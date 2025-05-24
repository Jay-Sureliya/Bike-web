import axios from 'axios';
import bikeImage from '../../assets/images/backgrong.jpg';
import Slider from "react-slick";
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [bikes, setBikes] = useState([]);
    const [Logo, setLogo] = useState([]);
    const sliderRef = useRef(null);
    const totalPages = 4;
    const slidesPerPage = Math.ceil(bikes.length / totalPages);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedBike, setSelectedBike] = useState(null);

    const handleDotClick = (pageIndex) => {
        setCurrentPage(pageIndex);
        sliderRef.current?.slickGoTo(pageIndex * slidesPerPage);
    };

    const closeModal = () => {
        setSelectedBike(null);
    };

    // ✅ Define the missing function
    const handleViewDetails = (bike) => {
        setSelectedBike(bike);
    };

    useEffect(() => {
        axios.get('https://bike-web.onrender.com/api/bikes')
            .then(res => setBikes(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        axios.get('https://bike-web.onrender.com/api/logo')
            .then(res => setLogo(res.data))
            .catch(err => console.error(err));
    }, []);

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        afterChange: (index) => {
            const page = Math.floor(index / slidesPerPage);
            setCurrentPage(page);
        },
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <>
            {/* Hero Section */}
            <section className="relative w-full h-screen flex items-center justify-center text-center text-white overflow-hidden">
                <img src={bikeImage} alt="Bike" className="absolute inset-0 w-full h-full object-cover z-0" />
                <div className="relative z-20 px-4">
                    <h1 className="text-3xl md:text-6xl font-bold text-red-500 mb-4">Ride the Future</h1>
                    <p className="text-sm md:text-xl text-gray-300 font-light mb-6 max-w-xl mx-auto">
                        Discover high-performance bikes built for speed, style, and sustainability.
                    </p>
                    <Link to={"/bikes"} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-[15px]  font-semibold transition">
                        Explore Bikes
                    </Link>
                </div>
            </section>

            {/* Trending Bikes Carousel */}
            <section className="py-12 bg-white">
                <div className="text-center mb-10">
                    <h2 className="text-xl md:text-3xl font-bold text-gray-800">Top 10 Trending Bikes</h2>
                    <p className="hidden md:block text-gray-500 text-sm mt-2">
                        Explore the best-selling bikes chosen by riders this year
                    </p>
                    <div className="w-24 h-1 bg-red-500 mx-auto mt-4 rounded"></div>
                </div>

                <div className="px-4 md:px-10 relative">
                    <Slider ref={sliderRef} {...settings}>
                        {bikes.map((bike, index) => (
                            <div key={index}>
                                <div className="bg-gray-100 rounded-lg shadow hover:shadow-md transition overflow-hidden">
                                    <img
                                        src={bike.image}
                                        alt={bike.name}
                                        className="w-full h-52 md:h-56 object-cover"
                                    />

                                    <div className="p-4 space-y-3">
                                        <span className="inline-block bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wider">
                                            🔥 Trending
                                        </span>

                                        <h2 className="text-lg md:text-xl font-bold text-gray-900">{bike.name}</h2>

                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Price:</span>
                                            <span className="text-gray-800 font-medium">
                                                ₹{bike.price.toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Color:</span>
                                            <span className="capitalize text-gray-800 font-medium">{bike.color}</span>
                                        </div>

                                        <div className="flex items-center text-yellow-400 text-sm group relative">
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <span key={i}>{i < Math.floor(bike.rating) ? "★" : "☆"}</span>
                                            ))}
                                            <span className="ml-2 text-xs group-hover:opacity-100 opacity-0 absolute -top-6 left-0 bg-gray-700 text-white px-2 py-1 rounded text-[10px] transition-opacity">
                                                Rating: {bike.rating.toFixed(1)} / 5
                                            </span>
                                        </div>

                                        <div className="text-green-600 text-xs font-medium mt-1">
                                            EMI starts at ₹{Math.round(bike.price / 24).toLocaleString()} /mo
                                        </div>

                                        <div className="flex gap-2 mt-4">
                                            <button
                                                onClick={() => handleViewDetails(bike)}
                                                className="flex-1 border border-gray-300 hover:bg-gray-100 text-sm font-semibold text-gray-700 py-2 rounded-md transition"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>

                    {/* Custom Dots */}
                    <div className="flex justify-center mt-4">
                        <ul className="flex space-x-2">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <li key={i}>
                                    <button
                                        onClick={() => handleDotClick(i)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${currentPage === i ? "bg-gray-800" : "bg-gray-400"}`}
                                        aria-label={`Go to page ${i + 1}`}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Modal */}
                    {selectedBike && (
                        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
                            <div className="bg-white w-[90%] max-w-md md:max-w-lg rounded-lg shadow-lg p-6 relative">
                                <button
                                    onClick={closeModal}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
                                >
                                    &times;
                                </button>

                                <img
                                    src={selectedBike.image}
                                    alt={selectedBike.name}
                                    className="w-full h-48 object-cover rounded-md mb-4"
                                />

                                <h2 className="text-xl font-bold mb-2">{selectedBike.name}</h2>

                                <p className="text-sm text-gray-700 mb-1">
                                    <strong>Price:</strong> ₹{selectedBike.price.toLocaleString()}
                                </p>

                                <p className="text-sm text-gray-700 mb-1">
                                    <strong>Color:</strong> {selectedBike.color}
                                </p>

                                <p className="text-sm text-gray-700 mb-1">
                                    <strong>Rating:</strong> {selectedBike.rating.toFixed(1)} / 5
                                </p>

                                <p className="text-sm text-gray-700">
                                    <strong>EMI:</strong> ₹{Math.round(selectedBike.price / 24).toLocaleString()} /mo
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Brand Logo */}
            <section className="py-8 bg-gray-50">
                <div className="text-center mb-10">
                    <h2 className="text-xl md:text-3xl font-bold text-gray-800">We Only Deal in These Brands</h2>
                    <div className="w-24 h-1 bg-red-500 mx-auto mt-4 rounded"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mx-12">
                    {Logo.map((brand) => (
                        <div
                            key={brand.name}
                            className="flex items-center justify-center p-6 rounded-xl bg-white
                 shadow-md hover:shadow-2xl transition duration-300 transform hover:scale-105 cursor-pointer"
                        >
                            <img
                                 src={brand.image.startsWith("/") ? brand.image : `/${brand.image}`}
                                alt={brand.name}
                                className="w-20 h-20 object-contain rounded-md"
                            />
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default Home;
   