import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const quickLinks = [
  { to: "/recipe-generator", icon: "🍳", title: "Generate a Recipe", desc: "From ingredients you already have" },
  { to: "/meal-planner", icon: "📅", title: "Plan Your Week", desc: "Get a full 7-day meal plan" },
  { to: "/grocery-list", icon: "🛒", title: "Grocery List", desc: "Build a shopping list from your plan" },
  { to: "/chatbot", icon: "💬", title: "Ask NutriChef", desc: "Chat about nutrition & recipes" },
  { to: "/saved-recipes", icon: "📖", title: "Saved Recipes", desc: "Browse & search your saved recipes" },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-8 max-w-5xl">
        <h1 className="text-2xl font-bold mb-1">
          Welcome back, {user?.name?.split(" ")[0] || "Chef"} 👋
        </h1>
        <p className="text-gray-500 mb-6">
          Diet goal:{" "}
          <span className="font-medium text-primary-700">
            {user?.dietGoal ? user.dietGoal.replaceAll("_", " ") : "Not set"}
          </span>
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {quickLinks.map((q) => (
            <Link key={q.to} to={q.to} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{q.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-800">{q.title}</h3>
                  <p className="text-sm text-gray-500">{q.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
