import React from "react";

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-gray-800 font-sans">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-6 text-center text-red-600">About Us</h1>

      {/* Introduction */}
      <section className="text-center mb-12">
        <p className="text-lg leading-relaxed max-w-3xl mx-auto">
          Welcome to <span className="font-semibold">BikeZone</span>, your destination for premium bikes,
          trusted support, and exciting adventures on two wheels. Whether you ride for sport, commute, or passion,
          we’re here to power your journey.
        </p>
      </section>

      {/* Mission and Values */}
      <section className="grid md:grid-cols-2 gap-10 mb-16">
        <div className="bg-gray-100 rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="leading-relaxed">
            At BikeZone, we believe that bikes bring freedom, joy, and health. Our mission is to make high-quality
            bikes accessible to all riders — from beginners to professionals — while promoting a sustainable lifestyle.
          </p>
        </div>
        <div className="bg-gray-100 rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Core Values</h2>
          <ul className="list-disc list-inside space-y-2 text-base">
            <li>Customer-first approach</li>
            <li>Affordable pricing with EMI options</li>
            <li>Eco-conscious and responsible</li>
            <li>Reliable post-sales support</li>
          </ul>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-16 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-3xl font-bold text-red-600">5K+</p>
            <p className="text-gray-600">Bikes Sold</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-red-600">98%</p>
            <p className="text-gray-600">Customer Satisfaction</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-red-600">15+</p>
            <p className="text-gray-600">Bike Models</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-red-600">24x7</p>
            <p className="text-gray-600">Support</p>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="bg-gray-100 rounded-lg py-10 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Join Our Journey</h2>
        <p className="max-w-xl mx-auto text-gray-700 mb-4">
          We’re always looking for passionate people to join our growing team. If you love bikes and want to make a
          difference, let’s connect.
        </p>
        <a
          href="/contact"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md transition"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
};

export default AboutPage;
