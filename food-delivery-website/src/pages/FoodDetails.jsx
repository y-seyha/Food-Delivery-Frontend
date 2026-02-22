import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import { useCart } from "../hooks/useCart";
import axiosInstance from "../api/axiosInstance";
import { API_PATHS } from "../api/apiPaths";
import { FaArrowLeft } from "react-icons/fa";

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const fetchFood = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.FOOD.DETAILS(id));
      setFood(res.data);
    } catch (error) {
      console.error("Failed to fetch food:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFood();
  }, [id]);

  if (loading) return <Loader />;

  if (!food)
    return <p className="text-center mt-20 text-red-500">Food not found!</p>;

  const handleAddToCart = () => {
    addToCart(food, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="w-full bg-white shadow-md border-b border-gray-200 flex items-center justify-between px-6 py-4 sticky top-0 z-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-red-500 
             bg-gray-100 hover:bg-red-50 px-3 py-2 rounded-lg shadow-sm transition font-medium"
        >
          <FaArrowLeft /> Back
        </button>
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
          Food Details
        </h1>
        <div className="w-10"></div>
      </header>

      {/* Centered Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col lg:flex-row items-center lg:items-start gap-8 p-6 lg:p-8 max-w-4xl w-full max-h-[calc(100vh-80px)]">
          {/* Left: Food Image */}
          <div className="lg:w-1/2 w-full relative flex-shrink-0">
            {added && (
              <span className="absolute top-4 left-4 bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md z-10">
                Added!
              </span>
            )}
            <img
              src={food.image || "/placeholder.png"}
              alt={food.name}
              className="w-full h-64 sm:h-80 lg:h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Right: Food Details */}
          <div className="lg:w-1/2 w-full flex flex-col gap-6 overflow-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {food.name}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              {food.description}
            </p>
            <p className="text-red-500 text-2xl sm:text-3xl font-bold">
              ${food.price}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mt-2">
              <span className="font-medium text-gray-700">Quantity:</span>
              <button
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 transition text-lg font-semibold"
              >
                -
              </button>
              <span className="font-medium text-gray-800">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 transition text-lg font-semibold"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="mt-6 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-semibold shadow-lg hover:shadow-xl relative"
            >
              Add {quantity} to Cart
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FoodDetails;
