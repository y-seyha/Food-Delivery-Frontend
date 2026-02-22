import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Loader from "../components/common/Loader";
import Footer from "../components/common/Footer";
import axiosInstance from "../api/axiosInstance";
import { API_PATHS } from "../api/apiPaths";
import FoodCard from "../components/food/FoodCard";
import { useCart } from "../hooks/useCart";

const Menu = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch foods from backend
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(API_PATHS.FOOD.FOODS);
        setFoods(res.data); // ensure each food has _id or id
      } catch (err) {
        console.error("API Error", err);
        setError("Failed to load food menu.");
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="pt-16 text-center text-red-500 font-bold">{error}</div>
    );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="pt-16">
        <section>
          <div className="max-w-[1400px] mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {foods.map((food) => (
              <FoodCard key={food._id || food.id} food={food} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Menu;
