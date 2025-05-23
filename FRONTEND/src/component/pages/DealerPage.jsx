import React, { useState, useEffect } from "react";

function DealerPage() {
  // State variables
  const [dealers, setDealers] = useState([]);         // List of dealers
  const [search, setSearch] = useState("");           // Search input text
  const [modalDealer, setModalDealer] = useState(null); // Dealer selected for contact modal
  const [mapUrl, setMapUrl] = useState("");           // URL of map for map modal
  const [formData, setFormData] = useState({          // Contact form data
    name: "",
    email: "",
    message: ""
  });
  const [sending, setSending] = useState(false);      // Sending message indicator
  const [sendStatus, setSendStatus] = useState(null); // Status of message send

  // Load dealers data once when component mounts
  useEffect(() => {
    async function fetchDealers() {
      try {
        const response = await fetch("http://localhost:3000/api/dealers");
        if (!response.ok) {
          throw new Error("Failed to fetch dealers");
        }
        const data = await response.json();
        setDealers(data);
      } catch (error) {
        console.error("Error fetching dealers:", error);
      }
    }
    fetchDealers();
  }, []);

  // Filter dealers by search input (name or location)
  const filteredDealers = dealers.filter(function(dealer) {
    const lowerSearch = search.toLowerCase();
    return (
      dealer.name.toLowerCase().includes(lowerSearch) ||
      dealer.location.toLowerCase().includes(lowerSearch)
    );
  });

  // Handle form input changes
  function handleInputChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    // Update only the changed field in formData
    setFormData(function(prevFormData) {
      return {
        ...prevFormData,
        [name]: value
      };
    });
  }

  // Reset contact form fields to empty
  function resetForm() {
    setFormData({
      name: "",
      email: "",
      message: ""
    });
  }

  // Handle sending the contact message form
  async function handleSendMessage(event) {
    event.preventDefault();

    if (!modalDealer) {
      return; // No dealer selected
    }

    // Check if all fields are filled
    if (!formData.name || !formData.email || !formData.message) {
      setSendStatus("error");
      return;
    }

    setSending(true);
    setSendStatus(null);

    try {
      const response = await fetch("http://localhost:3000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          dealerId: modalDealer._id,
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSendStatus("success");
      resetForm();

      // Close modal and reset status after 1.5 seconds
      setTimeout(function() {
        setModalDealer(null);
        setSendStatus(null);
      }, 1500);
    } catch (error) {
      setSendStatus("error");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-white text-black">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">
          Our Trusted Dealers
        </h1>

        {/* Search box */}
        <div className="mb-6 flex justify-center">
          <input
            type="search"
            placeholder="Search by name or location"
            value={search}
            onChange={function(e) {
              setSearch(e.target.value);
            }}
            className="w-full max-w-md px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
            aria-label="Search dealers"
          />
        </div>

        {/* Dealer cards grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDealers.map(function(dealer) {
            return (
              <article
                key={dealer._id}
                className="border border-gray-300 rounded-lg p-5 sm:p-6 shadow-sm hover:shadow-md transition"
                aria-label={"Dealer " + dealer.name}
              >
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">{dealer.name}</h2>
                <p className="mb-1 text-sm sm:text-base">📍 {dealer.location}</p>
                <p className="mb-1 text-sm sm:text-base">📞 {dealer.phone}</p>
                <p className="mb-4 text-sm sm:text-base">✉️ {dealer.email}</p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={function() {
                      setModalDealer(dealer);
                      setSendStatus(null);
                      resetForm();
                    }}
                    className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition text-sm sm:text-base flex-grow sm:flex-grow-0 text-center"
                  >
                    Contact Dealer
                  </button>

                  <button
                    onClick={function() {
                      setMapUrl(dealer.mapUrl);
                    }}
                    className="border border-gray-300 hover:bg-gray-100 text-gray-800 px-3 py-2 rounded transition text-sm sm:text-base flex-grow sm:flex-grow-0 text-center"
                  >
                    View Location
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Contact Modal */}
      {modalDealer && (
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4"
        >
          <div className="bg-white p-5 sm:p-6 rounded-lg max-w-md w-full relative shadow-lg">
            <button
              onClick={function() {
                setModalDealer(null);
              }}
              aria-label="Close contact form"
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-3xl font-bold"
            >
              &times;
            </button>

            <h3 id="modal-title" className="text-xl sm:text-2xl font-semibold mb-4">
              Contact {modalDealer.name}
            </h3>

            <form onSubmit={handleSendMessage} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows="4"
                value={formData.message}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
              />
              <button
                type="submit"
                disabled={sending}
                className="hover:bg-red-700 text-white px-4 py-2 rounded bg-red-600 disabled:opacity-50 transition w-full sm:w-auto"
              >
                {sending ? "Sending..." : "Send Message"}
              </button>

              {/* Send message status */}
              {sendStatus === "success" && (
                <p className="text-green-600 mt-2 text-sm sm:text-base">
                  Message sent successfully!
                </p>
              )}
              {sendStatus === "error" && (
                <p className="text-red-600 mt-2 text-sm sm:text-base">
                  Failed to send message. Please try again.
                </p>
              )}
            </form>
          </div>
        </section>
      )}

      {/* Map Modal */}
      {mapUrl && (
        <section
          role="dialog"
          aria-modal="true"
          aria-label="Dealer location map"
          className="fixed inset-0 z-40 bg-black bg-opacity-60 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-lg overflow-hidden shadow-xl relative w-full max-w-4xl h-[60vh]">
            <button
              onClick={function() {
                setMapUrl("");
              }}
              aria-label="Close map"
              className="absolute top-2 right-2 text-gray-700 hover:text-black text-3xl font-bold z-10"
            >
              &times;
            </button>
            <iframe
              src={mapUrl}
              title="Dealer Location"
              className="w-full h-full border-none"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </section>
      )}
    </div>
  );
}

export default DealerPage;
