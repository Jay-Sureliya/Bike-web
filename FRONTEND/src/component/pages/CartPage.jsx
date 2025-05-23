import React, { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const cartWithQty = storedCart.map((item) => ({
        ...item,
        quantity: item.quantity || 1,
      }));
      setCartItems(cartWithQty);
    }, 800);
  }, []);

  const updateCart = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const handleRemove = (id) => {
    const updated = cartItems.filter((item) => item._id !== id);
    updateCart(updated);
  };

  const handleQtyChange = (id, delta) => {
    const updated = cartItems.map((item) => {
      if (item._id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    updateCart(updated);
  };

  const totalPrice = cartItems
    ? cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  const proceedCheckout = () => {
    setShowCheckout(true);
  };

  const confirmOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      localStorage.removeItem("cart");
      setCartItems([]);
      setShowCheckout(false);
      setIsProcessing(false);
      toast.success("Thank you for your order!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }, 1500);
  };

  if (cartItems === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-green-100 to-green-50">
        <svg
          className="animate-spin h-16 w-16 text-green-700"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-sans min-h-screen bg-gradient-to-tr">
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-10 border-b border-green-300 pb-4">
        Your Shopping Cart
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-600 mt-40 select-none">
          <div className="text-8xl mb-6">🛒</div>
          <p className="text-lg font-semibold">Your cart is currently empty.</p>
          <p className="mt-2 text-gray-400 text-base">
            Add some amazing bikes to get started!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-28 h-28 rounded-2xl object-cover shadow-md"
                />
                <div className="flex-1 ml-4">
                  <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                  <p className="text-gray-700 capitalize mt-1 tracking-wide text-sm">
                    Color: {item.color}
                  </p>
                  <p className="text-red-600 font-semibold text-base mt-2">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>

                  <div className="flex items-center space-x-3 mt-3">
                    <div className="flex items-center border border-green-300 rounded-xl overflow-hidden w-max shadow-sm select-none">
                      <button
                        onClick={() => handleQtyChange(item._id, -1)}
                        disabled={item.quantity <= 1}
                        className="px-2 py-1 bg-green-50 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-green-700 font-semibold transform active:scale-90 text-sm"
                      >
                        –
                      </button>
                      <span className="px-3 py-1 text-sm font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQtyChange(item._id, 1)}
                        className="px-2 py-1 bg-green-50 hover:bg-green-100 transition-colors text-green-700 font-semibold transform active:scale-90 text-sm"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item._id)}
                      className="ml-auto text-red-600 hover:text-red-800 font-medium text-xs transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-lg select-none transform active:scale-90"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-right">
            <p className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-wide">
              Total: ₹{totalPrice.toLocaleString()}
            </p>
            <button
              onClick={proceedCheckout}
              className="mt-6 bg-green-700 hover:bg-green-800 text-white font-extrabold px-10 py-3 rounded-3xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-400 transform active:scale-95 text-sm"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-title"
          style={{ animation: "fadeIn 0.3s ease forwards" }}
          ref={modalRef}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative transform transition-transform duration-300"
            style={{ animation: "scaleIn 0.3s ease forwards" }}
          >
            <h3
              id="checkout-title"
              className="text-xl md:text-2xl font-extrabold mb-6 text-gray-900 text-center"
            >
              Order Summary
            </h3>
            <div className="max-h-64 overflow-y-auto mb-6 space-y-4 px-2">
              {cartItems.map((item) => (
                <div
                  key={`summary-${item._id}`}
                  className="flex justify-between items-center border-b border-gray-200 pb-2"
                >
                  <div>
                    <p className="font-semibold text-base text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500 tracking-wide">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-red-600 text-base">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-right text-lg md:text-xl font-extrabold mb-6 tracking-wide text-gray-900">
              Total: ₹{totalPrice.toLocaleString()}
            </p>
            <div className="flex justify-center space-x-5">
              <button
                onClick={() => setShowCheckout(false)}
                disabled={isProcessing}
                className="px-6 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-gray-400 font-semibold transform active:scale-95 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmOrder}
                disabled={isProcessing}
                className="px-8 py-2 rounded-xl bg-green-700 hover:bg-green-800 text-white font-extrabold focus:outline-none focus:ring-4 focus:ring-green-400 transform active:scale-95 flex items-center justify-center space-x-2 text-sm"
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  "Confirm Order"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from {opacity: 0;}
          to {opacity: 1;}
        }
        @keyframes scaleIn {
          from {transform: scale(0.9);}
          to {transform: scale(1);}
        }
      `}</style>

      <ToastContainer />
    </div>
  );
};

export default CartPage;
