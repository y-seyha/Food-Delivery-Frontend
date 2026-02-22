import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { useCart } from "../hooks/useCart";
import axiosInstance from "../api/axiosInstance";
import { API_PATHS } from "../api/apiPaths";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      setCheckingOut(true);

      const orderItems = cartItems.map((item) => ({
        foodId: item._id,
        quantity: item.quantity,
      }));

      const orderBody = {
        foods: orderItems,
        address: "Home Address", // TODO: replace with real user input
        paymentMethod, // <-- send selected payment method
      };

      await axiosInstance.post(API_PATHS.ORDER.CREATE, orderBody);

      clearCart();
      navigate("/tracking");
    } catch (error) {
      console.error("Failed to place order:", error);
      alert(error.response?.data?.message || "Failed to place order");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Header */}
      <div className="bg-white shadow-md px-6 py-4 flex items-center relative border-b border-gray-200">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-700 hover:text-red-500 
               bg-gray-100 hover:bg-red-50 px-3 py-2 rounded-lg 
               transition font-medium shadow-sm"
        >
          <FaArrowLeft className="text-base" />
          Back
        </button>

        <h1 className="absolute left-1/2 -translate-x-1/2 text-gray-800 font-semibold text-lg sm:text-xl">
          Cart
        </h1>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          {/* LEFT:*/}
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-6">Cart Items</h2>

            {cartItems.length === 0 && (
              <p className="text-center text-gray-500 py-10">
                Your cart is empty
              </p>
            )}

            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row gap-4 sm:items-center border-b pb-6 last:border-b-0"
                >
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="w-full sm:w-24 h-40 sm:h-24 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            item.quantity > 1 && addToCart(item, -1)
                          }
                          className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                          −
                        </button>
                        <span className="font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => addToCart(item, 1)}
                          className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 hover:text-red-600 text-sm"
                        >
                          <FaTrash className="h-9 cursor-pointer" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right mt-2 sm:mt-0">
                    <p className="font-semibold text-lg text-red-500">
                      Total: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400">
                      Price: ${item.price} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: */}
          <div className="bg-white rounded-2xl shadow-md p-6 h-fit lg:sticky lg:top-6">
            <h2 className="text-xl font-semibold mb-6">Payment</h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items</span>
                <span>
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-red-500">${totalPrice.toFixed(2)}</span>
              </div>

              {/* Payment method selection */}
              <div className="mt-4">
                <p className="text-gray-700 font-semibold mb-2">
                  Select Payment Method:
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setPaymentMethod("cash")}
                    className={`px-4 py-2 rounded-lg border ${
                      paymentMethod === "cash"
                        ? "bg-red-500 text-white border-red-500 cursor-pointer"
                        : "bg-white text-gray-700 border-gray-300 cursor-pointer"
                    }`}
                  >
                    Cash
                  </button>
                  <button
                    onClick={() => setPaymentMethod("online")}
                    className={`px-4 py-2 rounded-lg border ${
                      paymentMethod === "online"
                        ? "bg-red-500 text-white border-red-500 cursor-pointer"
                        : "bg-white text-gray-700 border-gray-300 cursor-pointer"
                    }`}
                  >
                    Online
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={clearCart}
                className="w-full py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Clear Cart
              </button>

              <button
                onClick={handleCheckout}
                disabled={checkingOut || cartItems.length === 0}
                className="w-full py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
              >
                {checkingOut ? "Processing..." : "Checkout"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
