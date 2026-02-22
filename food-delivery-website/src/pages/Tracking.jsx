import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { API_PATHS } from "../api/apiPaths";
import { FaArrowLeft, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import Loader from "../components/common/Loader";
import { socket } from "../socket";

const Tracking = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATHS.ORDER.MY_ORDERS);
      const data = Array.isArray(res.data) ? res.data : res.data.orders || [];
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Cancel an order
  const handleCancel = async (orderId) => {
    try {
      console.log("Canceling order:", orderId);
      const res = await axiosInstance.put(`/orders/${orderId}/cancel`);
    } catch (err) {
      console.error(
        "Failed to cancel order:",
        err.response?.data || err.message,
      );
      alert(
        err.response?.data?.message ||
          "Could not cancel the order. Please try again.",
      );
    }
  };

  useEffect(() => {
    fetchOrders(); // load current orders

    const userId = localStorage.getItem("userId");

    socket.on("orderCreated", (order) => {
      const orderUserId = order.user._id || order.user;
      if (orderUserId === userId) {
        setOrders((prev) => [order, ...prev]);
      }
    });

    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o)),
      );
    });

    socket.on("orderCanceled", (order) => {
      const orderUserId = order.user._id || order.user;
      if (orderUserId === userId) {
        setOrders((prev) => prev.map((o) => (o._id === order._id ? order : o)));
      }
    });

    return () => {
      socket.off("orderCreated");
      socket.off("orderUpdated");
      socket.off("orderCanceled");
    };
  }, []);

  if (loading) return <Loader />;
  if (!orders.length)
    return (
      <div className="p-6 max-w-6xl mx-auto text-center">
        <p className="text-gray-500 text-lg">You have no orders yet.</p>
      </div>
    );

  // Map backend status to colors
  const statusColors = {
    Pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      bar: "bg-yellow-400 w-1/2",
    },
    Delivered: {
      bg: "bg-green-100",
      text: "text-green-700",
      bar: "bg-green-500 w-full",
    },
    Cancelled: {
      bg: "bg-red-100",
      text: "text-red-700",
      bar: "bg-red-500 w-full",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
          Tracking
        </h1>
      </header>

      {/* Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Page Heading */}
        <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">
          Order Tracking
        </h1>

        <div className="space-y-8">
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
                className="bg-white rounded-2xl shadow-md p-6 space-y-6"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <p className="font-semibold">
                      Order ID:{" "}
                      <span className="text-gray-500">{order._id}</span>
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                      <FaClock /> {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-1 h-fit rounded-full text-sm font-medium ${color.bg} ${color.text}`}
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
                      key={item.food._id}
                      className="flex justify-between items-center py-4 gap-4"
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
                          <p className="font-semibold">{item.food?.name}</p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold">
                        ${(item.food?.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-xl text-red-500">
                    ${order.total.toFixed(2)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-3 transition-all duration-500 ${color.bar}`}
                  ></div>
                </div>

                {/* Cancel button */}
                {order.status.toLowerCase() === "pending" && (
                  <div className="text-right mt-2">
                    <button
                      onClick={() => handleCancel(order._id)}
                      className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Tracking;
