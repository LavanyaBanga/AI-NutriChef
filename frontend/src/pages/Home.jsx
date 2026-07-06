import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const features = [
  { icon: "🍳", title: "AI Recipe Generator", desc: "Turn your available ingredients into delicious, nutrition-tracked recipes." },
  { icon: "📅", title: "Weekly Meal Planner", desc: "Get a full 7-day meal plan tailored to your diet goal." },
  { icon: "🛒", title: "Smart Grocery Lists", desc: "Auto-generate a shopping list from your weekly meal plan." },
  { icon: "💬", title: "Nutrition Chatbot", desc: "Ask any food or nutrition question, any time." },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
        🥗 AI <span className="text-primary-600">NutriChef</span>
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
        Your smart AI-powered kitchen companion. Get personalized recipes, meal plans,
        and grocery lists based on your ingredients, diet goals, and allergies.
      </p>

      <Link to={user ? "/dashboard" : "/signup"} className="btn-primary text-base px-6 py-3 inline-block">
        {user ? "Go to Dashboard" : "Get Started Free"}
      </Link>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-16 text-left">
        {features.map((f) => (
          <div key={f.title} className="card">
            <div className="text-3xl mb-2">{f.icon}</div>
            <h3 className="font-semibold text-gray-800 mb-1">{f.title}</h3>
            <p className="text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
