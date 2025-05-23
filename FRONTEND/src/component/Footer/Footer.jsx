import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-black text-gray-300 py-12 mt-8">
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* About Section */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">BikeStore</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Your ultimate destination for the best bikes. Quality rides for every adventure and city journey.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="hidden md:block">
                    <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link to="/" className="hover:text-red-500 transition">Home</Link>
                        </li>
                        <li>
                            <Link to="/bikes" className="hover:text-red-500 transition">Bikes</Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:text-red-500 transition">About Us</Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-red-500 transition">Contact</Link>
                        </li>
                    
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
                    <p className="text-sm mb-2">123 Bike Lane, Cycle City, 45678</p>
                    <p className="text-sm mb-2">Phone: +91 98765 43210</p>
                    <p className="text-sm mb-2">Email: support@bikestore.com</p>
                </div>

                {/* Social Media */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
                    <div className="flex space-x-4 text-gray-400">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="hover:text-blue-600 transition"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                className="w-6 h-6"
                                viewBox="0 0 24 24"
                            >
                                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.987h-2.54v-2.892h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.466h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.892h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
                            </svg>
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Twitter"
                            className="hover:text-blue-400 transition"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                className="w-6 h-6"
                                viewBox="0 0 24 24"
                            >
                                <path d="M23 3a10.9 10.9 0 01-3.14.86 4.48 4.48 0 001.98-2.48 9.05 9.05 0 01-2.88 1.1 4.52 4.52 0 00-7.69 4.12A12.82 12.82 0 013 4.15a4.48 4.48 0 001.4 6.04 4.45 4.45 0 01-2.05-.57v.06a4.53 4.53 0 003.63 4.43 4.5 4.5 0 01-2.04.07 4.52 4.52 0 004.22 3.13A9.05 9.05 0 013 19.54a12.81 12.81 0 006.92 2.03c8.3 0 12.85-6.87 12.85-12.83 0-.2 0-.41-.01-.61A9.18 9.18 0 0023 3z" />
                            </svg>
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="hover:text-pink-500 transition"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                className="w-6 h-6"
                                viewBox="0 0 24 24"
                            >
                                <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 2A3.75 3.75 0 004 7.75v8.5A3.75 3.75 0 007.75 20h8.5a3.75 3.75 0 003.75-3.75v-8.5A3.75 3.75 0 0016.25 4h-8.5zm8.5 1.5a1 1 0 110 2 1 1 0 010-2zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <div className="text-center text-gray-500 text-sm mt-10">
                &copy; {new Date().getFullYear()} BikeStore. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
