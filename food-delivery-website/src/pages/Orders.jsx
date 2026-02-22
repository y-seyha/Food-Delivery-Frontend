import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { API_PATHS } from "../api/apiPaths";
import Loader from "../components/common/Loader";
import { FaArrowLeft, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.ORDER.MY_ORDERS);
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  // Map backend status to colors
  const statusColors = {
    Pending: { bg: "bg-yellow-100", text: "text-yellow-700" },
    Delivered: { bg: "bg-green-100", text: "text-green-700" },
    Cancelled: { bg: "bg-red-100", text: "text-red-700" },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full-width Header */}
      <header className="w-full bg-white shadow-md border-b border-gray-200 relative px-6 py-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/menu")}
          className="flex items-center gap-2 text-gray-700 hover:text-red-500 
              bg-gray-100 hover:bg-red-50 px-3 py-2 rounded-lg 
              transition font-medium shadow-sm"
        >
          <FaArrowLeft className="text-base" />
          Back
        </button>

        {/* Title */}
        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg sm:text-xl font-semibold text-gray-800">
          My Order
        </h1>
      </header>

      {/* Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Empty State */}
        {orders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <p className="text-gray-500 text-lg mb-4">
              You haven’t placed any orders yet 🍽️
            </p>
            <button
              onClick={() => navigate("/menu")}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
            >
              Browse Food
            </button>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-8 mt-4">
          {orders.map((order) => {
            const statusKey =
              order.status.charAt(0).toUpperCase() + order.status.slice(1);
            const color = statusColors[statusKey] || {
              bg: "bg-gray-100",
              text: "text-gray-700",
              bar: "bg-gray-400 w-full",
            };

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6 hover:shadow-xl transition"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Order ID:{" "}
                      <span className="text-gray-500">{order._id}</span>
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                      <FaClock /> {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium ${color.bg} ${color.text}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Address */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span>{order.address}</span>
                </div>

                {/* Items */}
                <div className="divide-y">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            item.food?.image || "https://via.placeholder.com/80"
                          }
                          alt={item.food?.name}
                          className="w-16 h-16 rounded-lg object-cover border"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.food?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-800 mt-2 sm:mt-0">
                        ${(item.food?.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="font-semibold text-lg text-gray-800">
                    Total
                  </span>
                  <span className="font-bold text-xl text-red-500">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Orders;
