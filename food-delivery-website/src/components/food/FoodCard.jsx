import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

const FoodCard = ({ food }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Add selected quantity to cart
  const handleAddToCart = () => {
    addToCart(food, quantity); // pass quantity
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Navigate
  const handleView = () => {
    navigate(`/foods/${food.id || food._id}`);
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Image Wrapper */}
      <div
        onClick={handleView}
        className="relative w-full h-40 sm:h-44 md:h-48 overflow-hidden cursor-pointer"
      >
        <img
          src={food.image || "/placeholder.png"}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />

        {/* Price Badge */}
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs sm:text-sm px-3 py-1 rounded-full shadow-md">
          ${food.price}
        </span>

        {/* Added Animation */}
        {added && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow animate-bounce">
            Added ✓
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 sm:p-4">
        <h2
          onClick={handleView}
          className="font-semibold text-sm sm:text-base md:text-lg line-clamp-1 cursor-pointer"
        >
          {food.name}
        </h2>

        <p className="text-gray-500 text-xs sm:text-sm mt-1 line-clamp-2 flex-1">
          {food.description}
        </p>

        {/* Bottom Section */}
        <div className="mt-3 flex items-center justify-between gap-2">
          {/* Quantity Selector */}
          <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
            <button
              onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
              className="w-7 h-7 text-sm rounded-full hover:bg-gray-200 transition"
            >
              −
            </button>

            <span className="text-sm font-medium w-6 text-center">
              {quantity}
            </span>

            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              className="w-7 h-7 text-sm rounded-full hover:bg-gray-200 transition"
            >
              +
            </button>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-red-500 hover:bg-red-600 active:scale-95 transition text-white text-xs sm:text-sm font-medium py-2 rounded-full shadow"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
